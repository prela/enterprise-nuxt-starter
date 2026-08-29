import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { fetch, getServerLogs, setup, startServer, stopServer, useTestContext } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

// Docs-shaped omit fixture: Core, UI, content, seo, i18n — no Identity.
const rootDir = fileURLToPath(new URL('./fixtures/docs-host', import.meta.url))

describe('docs-shaped omit fixture HTTP', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
    // Catalogue Layers make Nitro slower to build than the v1 Host.
    setupTimeout: 180_000,
  })

  it('boots the omit fixture Host rather than the Playground', () => {
    // @nuxt/test-utils falls back to process.cwd() when rootDir is not a Nuxt app.
    expect(useTestContext().options.rootDir).toBe(rootDir)
  })

  it('boots and serves home without Identity', async () => {
    const response = await fetch('/', { headers: { accept: 'text/html' } })

    expect(response.status).toBe(200)
  })

  it('does not expose Identity routes', async () => {
    const login = await fetch('/login', { headers: { accept: 'text/html' } })
    const register = await fetch('/register', { headers: { accept: 'text/html' } })
    const protectedPage = await fetch('/protected', { headers: { accept: 'text/html' } })

    expect(login.status).toBe(404)
    expect(register.status).toBe(404)
    expect(protectedPage.status).toBe(404)
  })

  it('readiness fails and must not be cached when PostgreSQL is down', async () => {
    const response = await fetch('/ready')

    expect(response.status).toBe(503)
    expect(response.headers.get('content-type') ?? '').toMatch(/json/i)
    expect(response.headers.get('cache-control') ?? '').toMatch(/no-store/i)
  })

  it('readiness succeeds and must not be cached when PostgreSQL is up', async () => {
    // Omit Identity does not omit Core’s database boot contract.
    const postgres = new PGlite()
    const postgresWire = new PGLiteSocketServer({
      db: postgres,
      host: '127.0.0.1',
      port: 55438,
    })
    await postgresWire.start()

    try {
      await stopServer()
      await startServer({
        env: {
          NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
          NUXT_DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55438/postgres',
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
        },
      }),
    ).rejects.toThrow()
    expect(getServerLogs().join('\n')).toMatch(/ZodError|databaseUrl|NUXT_DATABASE_URL/i)
  })
})
