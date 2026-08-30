import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { fetch, getServerLogs, setup, startServer, stopServer, useTestContext } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

// PMS-shaped omit fixture: Core, UI, Identity — no content, seo, or i18n.
const rootDir = fileURLToPath(new URL('./fixtures/pms-host', import.meta.url))

describe('pms-shaped omit fixture HTTP', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
    // Identity Nitro build still needs more than the default 60s server start.
    setupTimeout: 180_000,
  })

  it('boots the omit fixture Host rather than the Playground', () => {
    // @nuxt/test-utils falls back to process.cwd() when rootDir is not a Nuxt app.
    expect(useTestContext().options.rootDir).toBe(rootDir)
  })

  it('boots and serves login', async () => {
    const response = await fetch('/login', { headers: { accept: 'text/html' } })

    expect(response.status).toBe(200)
  })

  it('does not expose docs routes', async () => {
    const response = await fetch('/docs', { headers: { accept: 'text/html' } })

    expect(response.status).toBe(404)
  })

  it('readiness fails and must not be cached when PostgreSQL is down', async () => {
    const response = await fetch('/ready')

    expect(response.status).toBe(503)
    expect(response.headers.get('content-type') ?? '').toMatch(/json/i)
    expect(response.headers.get('cache-control') ?? '').toMatch(/no-store/i)
  })

  it('readiness succeeds and must not be cached when PostgreSQL is up', async () => {
    // Catalogue Layers can be omitted; Core’s database boot contract cannot.
    const postgres = new PGlite()
    const postgresWire = new PGLiteSocketServer({
      db: postgres,
      host: '127.0.0.1',
      port: 55439,
    })
    await postgresWire.start()

    try {
      await stopServer()
      await startServer({
        env: {
          NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
          NUXT_DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55439/postgres',
          NUXT_BETTER_AUTH_SECRET: 'test-better-auth-secret-not-for-production',
        },
      })

      const response = await fetch('/ready')

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type') ?? '').toMatch(/json/i)
      expect(response.headers.get('cache-control') ?? '').toMatch(/no-store/i)
    }
    finally {
      await postgresWire.stop()
      await postgres.close()
    }
  })

  it('refuses to start when NUXT_DATABASE_URL is missing', async () => {
    await stopServer()

    await expect(
      startServer({
        env: {
          NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
          NUXT_DATABASE_URL: '',
          NUXT_BETTER_AUTH_SECRET: 'test-better-auth-secret-not-for-production',
        },
      }),
    ).rejects.toThrow()
    expect(getServerLogs().join('\n')).toMatch(/ZodError|databaseUrl|NUXT_DATABASE_URL/i)
  })
})
