import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// Host HTTP smoke for preview (`PREVIEW_URL`) and production (`PRODUCTION_URL`).
// Same contract: health, readiness, baseline headers, CSP report-only.

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
