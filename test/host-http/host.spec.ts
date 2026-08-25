import { fileURLToPath } from 'node:url'
import { fetch, getServerLogs, setup, startServer, stopServer } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))

describe('host HTTP', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
  })

  it('health returns success and must not be cached', async () => {
    const response = await fetch('/health')

    expect(response.status).toBe(200)
    // A JSON probe, not the Host HTML fallback that Nuxt would also serve as 200.
    expect(response.headers.get('content-type') ?? '').toMatch(/json/i)
    // no-store is the HTTP contract that stops an orchestrator from keeping a stale "ok".
    expect(response.headers.get('cache-control') ?? '').toMatch(/no-store/i)
  })

  it('readiness returns success only when the process can serve, and must not be cached', async () => {
    const response = await fetch('/ready')

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type') ?? '').toMatch(/json/i)
    expect(response.headers.get('cache-control') ?? '').toMatch(/no-store/i)
  })

  it('home tells the visitor this is a Playground, not a Product', async () => {
    const response = await fetch('/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toMatch(/Playground/)
    expect(html).toMatch(/not a Product/)
  })

  it('home chrome is mobile-first, exposes a main landmark, skip link, and color-mode control', async () => {
    const response = await fetch('/')
    const html = await response.text()

    expect(html).toMatch(/lang="en"/)
    expect(html).toMatch(/Skip to main content/)
    expect(html).toMatch(/id="main"/)
    expect(html).toMatch(/<main\b/)
    expect(html).toMatch(/Switch between light and dark mode/)
    expect(html).toMatch(/name="viewport"/)
  })

  it('unknown routes render error chrome that still names the Playground', async () => {
    // ofetch defaults to JSON; a visitor's browser asks for HTML.
    const response = await fetch('/this-route-does-not-exist', { headers: { accept: 'text/html' } })
    const html = await response.text()

    expect(response.status).toBe(404)
    expect(html).toMatch(/Playground/)
    expect(html).toMatch(/Page not found/)
    expect(html).toMatch(/That page is not available/)
    expect(html).toMatch(/<main\b/)
    expect(html).toMatch(/Skip to main content/)
    expect(html).toMatch(/Switch between light and dark mode/)
  })

  it('sends baseline headers and CSP in report-only, not enforced', async () => {
    const response = await fetch('/')
    const csp = response.headers.get('content-security-policy')
    const cspReportOnly = response.headers.get('content-security-policy-report-only')

    // Known baseline names; values come from the security module, not from this test recomputing them.
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(response.headers.get('x-frame-options')).toBeTruthy()
    expect(response.headers.get('referrer-policy')).toBeTruthy()

    expect(cspReportOnly).toBeTruthy()
    expect(csp).toBeNull()
  })

  it('refuses to start when required env is missing or invalid, with a Zod failure', async () => {
    await stopServer()

    await expect(
      startServer({
        env: {
          NUXT_PUBLIC_SITE_URL: '',
        },
      }),
    ).rejects.toThrow()
    expect(getServerLogs().join('\n')).toMatch(/ZodError|siteUrl|Invalid URL/i)

    await expect(
      startServer({
        env: {
          NUXT_PUBLIC_SITE_URL: 'not-a-url',
        },
      }),
    ).rejects.toThrow()
    // Startup is the seam: the process must surface Zod, not a generic crash.
    expect(getServerLogs().join('\n')).toMatch(/ZodError|siteUrl|Invalid URL/i)
  })
})
