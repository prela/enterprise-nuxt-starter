import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// Host HTTP smoke for preview (`PREVIEW_URL`) and production (`PRODUCTION_URL`).
// Same contract: health, readiness, baseline headers, CSP report-only, and Catalogue Layer
// Host HTTP. Does not register a Principal, set a Session cookie, or run Playwright.

export interface SmokeResult {
  ok: boolean
  failures: string[]
}

export interface SmokeOptions {
  /** Coolify rebuilds drop /ready; wait this long before treating 503 as a failed smoke. */
  waitMs?: number
  pollMs?: number
}

function header(response: Response, name: string): string {
  return response.headers.get(name) ?? ''
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForReady(baseUrl: string, waitMs: number, pollMs: number, failures: string[]): Promise<void> {
  if (waitMs <= 0)
    return

  const deadline = Date.now() + waitMs
  while (Date.now() <= deadline) {
    try {
      const response = await fetch(new URL('/ready', baseUrl))
      if (response.status === 200)
        return
    }
    catch {
      // Coolify proxy returns connection errors while the Playground container is replaced.
    }
    await sleep(pollMs)
  }

  failures.push('ready: timed out waiting for 200')
}

async function checkProbe(baseUrl: string, path: '/health' | '/ready', failures: string[]): Promise<void> {
  const name = path === '/health' ? 'health' : 'ready'
  let response: Response
  try {
    response = await fetch(new URL(path, baseUrl))
  }
  catch (error) {
    failures.push(`${name}: request failed (${error instanceof Error ? error.message : 'unknown error'})`)
    return
  }
  if (response.status !== 200)
    failures.push(`${name}: expected 200, got ${response.status}`)
  if (!/json/i.test(header(response, 'content-type')))
    failures.push(`${name}: expected JSON content-type`)
  // no-store is the contract that stops an orchestrator from keeping a stale "ok".
  if (!/no-store/i.test(header(response, 'cache-control')))
    failures.push(`${name}: Cache-Control must include no-store`)
}

function locationPath(baseUrl: string, location: string): string {
  try {
    return new URL(location, baseUrl).pathname
  }
  catch {
    return location
  }
}

async function checkDocs(baseUrl: string, failures: string[]): Promise<void> {
  // Catalogue Layer proof: /ready must not go green while /docs is 404 (10 Sep hole).
  let response: Response
  try {
    response = await fetch(new URL('/docs', baseUrl), { redirect: 'manual', headers: { accept: 'text/html' } })
  }
  catch (error) {
    failures.push(`docs: request failed (${error instanceof Error ? error.message : 'unknown error'})`)
    return
  }
  if (response.status !== 200) {
    failures.push(`docs: expected 200, got ${response.status}`)
    return
  }
  const html = await response.text()
  // Visitor-visible proof copy from the Host docs collection, not a Product handbook.
  if (!html.includes('Playground proof'))
    failures.push('docs: expected Playground proof copy')
}

async function checkHrRedirect(baseUrl: string, failures: string[]): Promise<void> {
  // Identity-era /hr is not a translated marketing home; the Host sends visitors to Croatian docs.
  let response: Response
  try {
    response = await fetch(new URL('/hr', baseUrl), { redirect: 'manual', headers: { accept: 'text/html' } })
  }
  catch (error) {
    failures.push(`hr: request failed (${error instanceof Error ? error.message : 'unknown error'})`)
    return
  }
  if (response.status < 300 || response.status >= 400) {
    failures.push(`hr: expected redirect, got ${response.status}`)
    return
  }
  if (locationPath(baseUrl, header(response, 'location')) !== '/hr/docs')
    failures.push('hr: expected Location /hr/docs')
}

function locPathnames(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    try {
      const pathname = new URL(match[1]).pathname.replace(/\/$/, '')
      return pathname === '' ? '/' : pathname
    }
    catch {
      return match[1]
    }
  })
}

async function collectSitemapXml(baseUrl: string, failures: string[]): Promise<string | undefined> {
  let response: Response
  try {
    // Follow redirects: a 307 from /sitemap.xml to the index is not a miss.
    response = await fetch(new URL('/sitemap.xml', baseUrl))
  }
  catch (error) {
    failures.push(`sitemap: request failed (${error instanceof Error ? error.message : 'unknown error'})`)
    return undefined
  }
  if (response.status !== 200) {
    failures.push(`sitemap: expected 200 after redirects, got ${response.status}`)
    return undefined
  }
  const first = await response.text()
  const bodies = [first]
  if (/<sitemapindex/i.test(first)) {
    for (const loc of [...first.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])) {
      try {
        const child = await fetch(loc)
        if (child.status !== 200) {
          failures.push(`sitemap: child ${loc} expected 200, got ${child.status}`)
          continue
        }
        bodies.push(await child.text())
      }
      catch (error) {
        failures.push(`sitemap: child ${loc} failed (${error instanceof Error ? error.message : 'unknown error'})`)
      }
    }
  }
  return bodies.join('\n')
}

async function checkSitemap(baseUrl: string, failures: string[]): Promise<void> {
  const xml = await collectSitemapXml(baseUrl, failures)
  if (xml === undefined)
    return
  // Advertised pages live in urlset loc entries, not sitemapindex child sitemap URLs.
  const urlsets = xml.match(/<urlset\b[\s\S]*?<\/urlset>/gi)
  const pages = urlsets ? urlsets.flatMap(locPathnames) : locPathnames(xml)
  if (!pages.includes('/'))
    failures.push('sitemap: expected home')
  if (!pages.includes('/docs'))
    failures.push('sitemap: expected /docs')
  if (!pages.includes('/hr/docs'))
    failures.push('sitemap: expected /hr/docs')
  for (const identityPath of ['/login', '/register', '/protected'] as const) {
    if (pages.includes(identityPath))
      failures.push(`sitemap: must not advertise ${identityPath}`)
  }
}

async function checkLogin(baseUrl: string, failures: string[]): Promise<void> {
  // Identity stays English and unprefixed; i18n must not move /login under /en.
  let response: Response
  try {
    response = await fetch(new URL('/login', baseUrl), { redirect: 'manual', headers: { accept: 'text/html' } })
  }
  catch (error) {
    failures.push(`login: request failed (${error instanceof Error ? error.message : 'unknown error'})`)
    return
  }
  if (response.status !== 200) {
    failures.push(`login: expected 200 on unprefixed /login, got ${response.status}`)
    return
  }
  const html = await response.text()
  // Visitor-visible English copy from Identity; Croatian locale must not claim this route.
  if (!html.includes('Sign in to the Playground'))
    failures.push('login: expected English Playground copy')
}

async function checkProtectedRedirect(baseUrl: string, failures: string[]): Promise<void> {
  // Identity is present without creating a Principal: anonymous visitors go to /login.
  let response: Response
  try {
    response = await fetch(new URL('/protected', baseUrl), { redirect: 'manual', headers: { accept: 'text/html' } })
  }
  catch (error) {
    failures.push(`protected: request failed (${error instanceof Error ? error.message : 'unknown error'})`)
    return
  }
  if (response.status < 300 || response.status >= 400) {
    failures.push(`protected: expected redirect, got ${response.status}`)
    return
  }
  if (locationPath(baseUrl, header(response, 'location')) !== '/login')
    failures.push('protected: expected Location /login')
}

async function checkHeaders(baseUrl: string, failures: string[]): Promise<void> {
  let response: Response
  try {
    response = await fetch(new URL('/', baseUrl))
  }
  catch (error) {
    failures.push(`home: request failed (${error instanceof Error ? error.message : 'unknown error'})`)
    return
  }
  // v1 CSP is report-only so Nuxt UI scripts can load while we observe violations.
  if (header(response, 'content-security-policy'))
    failures.push('home: Content-Security-Policy must not be enforced')
  if (!header(response, 'content-security-policy-report-only'))
    failures.push('home: Content-Security-Policy-Report-Only must be present')
  // Known baseline names; values come from the security module, not from this checker recomputing them.
  if (header(response, 'x-content-type-options') !== 'nosniff')
    failures.push('home: X-Content-Type-Options must be nosniff')
  if (!header(response, 'x-frame-options'))
    failures.push('home: X-Frame-Options must be present')
  if (!header(response, 'referrer-policy'))
    failures.push('home: Referrer-Policy must be present')
}

export async function smokePreview(baseUrl: string, options: SmokeOptions = {}): Promise<SmokeResult> {
  const failures: string[] = []
  const waitMs = options.waitMs ?? 0
  const pollMs = options.pollMs ?? 5_000
  await waitForReady(baseUrl, waitMs, pollMs, failures)
  if (failures.length > 0)
    return { ok: false, failures }
  await checkProbe(baseUrl, '/health', failures)
  await checkProbe(baseUrl, '/ready', failures)
  await checkHeaders(baseUrl, failures)
  await checkDocs(baseUrl, failures)
  await checkHrRedirect(baseUrl, failures)
  await checkSitemap(baseUrl, failures)
  await checkLogin(baseUrl, failures)
  await checkProtectedRedirect(baseUrl, failures)
  return { ok: failures.length === 0, failures }
}

function argValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag)
  if (index === -1)
    return undefined
  return argv[index + 1]
}

export async function runSmokeCli(argv: string[], env: Record<string, string | undefined>): Promise<number> {
  // Production and preview are the same Host HTTP contract; only the origin differs.
  const url = argValue(argv, '--url') ?? env.PRODUCTION_URL ?? env.PREVIEW_URL
  if (!url) {
    console.error('smoke: set PRODUCTION_URL or PREVIEW_URL or pass --url <origin>')
    return 1
  }
  const waitMs = Number(argValue(argv, '--wait-ms') ?? 0)
  const pollMs = Number(argValue(argv, '--poll-ms') ?? 5_000)
  const result = await smokePreview(url, { waitMs, pollMs })
  if (!result.ok) {
    for (const failure of result.failures)
      console.error(`smoke: ${failure}`)
    return 1
  }
  console.log(`smoke: ok ${url}`)
  return 0
}

const invoked = process.argv[1] ? resolve(process.argv[1]) : ''
if (invoked === fileURLToPath(import.meta.url)) {
  runSmokeCli(process.argv.slice(2), process.env).then((code) => {
    process.exitCode = code
  })
}
