import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { fetch, setup, startServer, stopServer } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))

function csrfTokenFrom(html: string): string {
  const match = html.match(/<meta name="csrf-token" content="([^"]+)">/)
  if (!match)
    throw new Error('CSRF meta tag missing from HTML')
  return match[1]
}

function cookieHeaderFrom(response: Response): string {
  const cookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie') ?? '']
  return cookies.filter(Boolean).map(cookie => cookie.split(';')[0]).join('; ')
}

async function pageAt(path: string): Promise<{ csrf: string, cookie: string }> {
  const response = await fetch(path, { headers: { accept: 'text/html' } })
  const html = await response.text()
  return {
    csrf: csrfTokenFrom(html),
    cookie: cookieHeaderFrom(response),
  }
}

async function postJson(path: string, input: {
  email: string
  password: string
  csrf: string
  cookie: string
}): Promise<Response> {
  return fetch(path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'csrf-token': input.csrf,
      'cookie': input.cookie,
    },
    body: JSON.stringify({ email: input.email, password: input.password }),
  })
}

// Seam: Host HTTP/UI. Route protection is observed as visitor vs member HTML,
// not by importing middleware or Better Auth types.

describe('host HTTP protected page', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
  })

  it('sends an anonymous visitor from the protected page to login without member-only content', async () => {
    // ofetch defaults to JSON; a visitor's browser asks for HTML.
    const response = await fetch('/protected', { headers: { accept: 'text/html' } })
    const html = await response.text()

    expect(html).not.toMatch(/Identity is working/)
    expect(html).toMatch(/Log in/)
    expect(html).toMatch(/<form\b/i)
    expect(html).toMatch(/<input[^>]*name="email"/i)
  })

  it('lets a logged-in member open the protected page', async () => {
    const postgres = new PGlite()
    const postgresWire = new PGLiteSocketServer({
      db: postgres,
      host: '127.0.0.1',
      port: 55435,
    })
    await postgresWire.start()

    const env = {
      NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
      NUXT_DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55435/postgres',
      // Better Auth rejects short secrets; this value is test-only.
      NUXT_BETTER_AUTH_SECRET: 'test-better-auth-secret-not-for-production',
    }

    try {
      await stopServer()
      await startServer({ env })

      const registered = await postJson('/api/identity/register', {
        email: 'member@example.com',
        password: 'password1',
        ...(await pageAt('/register')),
      })
      expect(registered.status).toBe(201)

      const loggedIn = await postJson('/api/identity/login', {
        email: 'member@example.com',
        password: 'password1',
        ...(await pageAt('/login')),
      })
      expect(loggedIn.status).toBe(200)

      const response = await fetch('/protected', {
        headers: {
          accept: 'text/html',
          cookie: cookieHeaderFrom(loggedIn),
        },
      })
      const html = await response.text()

      expect(response.status).toBe(200)
      expect(html).toMatch(/Protected page/)
      expect(html).toMatch(/Identity is working/)
      expect(html).not.toMatch(/<input[^>]*name="password"/i)
    }
    finally {
      await postgresWire.stop()
      await postgres.close()
    }
  })

  it('lets a logged-in member open the protected page when the site URL is HTTPS', async () => {
    const postgres = new PGlite()
    const postgresWire = new PGLiteSocketServer({
      db: postgres,
      host: '127.0.0.1',
      port: 55437,
    })
    await postgresWire.start()

    const env = {
      // Preview is HTTPS. Better Auth then prefixes the session cookie; the Host must still see the member.
      NUXT_PUBLIC_SITE_URL: 'https://127.0.0.1:3000',
      NUXT_DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55437/postgres',
      // Better Auth rejects short secrets; this value is test-only.
      NUXT_BETTER_AUTH_SECRET: 'test-better-auth-secret-not-for-production',
    }

    try {
      await stopServer()
      await startServer({ env })

      const registered = await postJson('/api/identity/register', {
        email: 'https-member@example.com',
        password: 'password1',
        ...(await pageAt('/register')),
      })
      expect(registered.status).toBe(201)

      const loggedIn = await postJson('/api/identity/login', {
        email: 'https-member@example.com',
        password: 'password1',
        ...(await pageAt('/login')),
      })
      expect(loggedIn.status).toBe(200)

      const response = await fetch('/protected', {
        headers: {
          accept: 'text/html',
          cookie: cookieHeaderFrom(loggedIn),
        },
      })
      const html = await response.text()

      expect(response.status).toBe(200)
      expect(html).toMatch(/Protected page/)
      expect(html).toMatch(/Identity is working/)
      expect(html).not.toMatch(/<input[^>]*name="password"/i)
    }
    finally {
      await postgresWire.stop()
      await postgres.close()
    }
  })
})
