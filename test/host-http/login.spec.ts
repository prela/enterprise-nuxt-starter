import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { fetch, setup, startServer, stopServer } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))

function csrfTokenFrom(html: string): string {
  const match = html.match(/<meta name="csrf-token" content="([^"]+)">/)
  if (!match)
    throw new Error('CSRF meta tag missing from login HTML')
  return match[1]
}

function cookieHeaderFrom(response: Response): string {
  const cookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie') ?? '']
  return cookies.filter(Boolean).map(cookie => cookie.split(';')[0]).join('; ')
}

function httpOnlySessionCookies(response: Response): string[] {
  const cookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie') ?? '']
  // Session cookie must be unreadable to page JavaScript; CSRF’s cookie is not the session.
  return cookies.filter(cookie =>
    /httponly/i.test(cookie)
    && !/^csrf=/i.test(cookie)
    && !/^__Host-csrf=/i.test(cookie),
  )
}

async function pageAt(path: string): Promise<{ csrf: string, cookie: string }> {
  const response = await fetch(path)
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

describe('host HTTP login', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
  })

  it('first paint of login is a real SSR form with email and password', async () => {
    const response = await fetch('/login')
    const html = await response.text()

    expect(response.status).toBe(200)
    // A visitor with JS off still sees a form, not an empty Identity shell.
    expect(html).toMatch(/<form\b/i)
    expect(html).toMatch(/<input[^>]*name="email"/i)
    expect(html).toMatch(/<input[^>]*name="password"/i)
    expect(html).toMatch(/<button[^>]*type="submit"|<input[^>]*type="submit"/i)
  })

  it('rejects a login POST that has no CSRF token', async () => {
    const response = await fetch('/api/identity/login', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'email=member@example.com&password=password1',
    })

    expect(response.status).toBe(403)
  })

  it('logs in a registered member, keeps an httpOnly session across SSR, and fails without enumerating email', async () => {
    const postgres = new PGlite()
    const postgresWire = new PGLiteSocketServer({
      db: postgres,
      host: '127.0.0.1',
      port: 55434,
    })
    await postgresWire.start()

    const env = {
      NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
      NUXT_DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55434/postgres',
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
      const loggedInBody = await loggedIn.json()

      expect(loggedIn.status).toBe(200)
      expect(loggedInBody).toEqual({
        ok: true,
        data: {
          id: expect.any(String),
          email: 'member@example.com',
        },
      })
      expect(httpOnlySessionCookies(loggedIn).length).toBeGreaterThan(0)

      const sessionCookie = cookieHeaderFrom(loggedIn)
      const anonymousLogin = await fetch('/login')
      expect(await anonymousLogin.text()).not.toMatch(/member@example.com/)

      // A new SSR request (refresh / navigation) must still see the same principal.
      const ssrRefresh = await fetch('/login', { headers: { cookie: sessionCookie } })
      const ssrHtml = await ssrRefresh.text()
      expect(ssrRefresh.status).toBe(200)
      expect(ssrHtml).toMatch(/Signed in as member@example.com/)
      expect(ssrHtml).toMatch(/<form\b/i)

      const wrongPassword = await postJson('/api/identity/login', {
        email: 'member@example.com',
        password: 'wrong-password',
        ...(await pageAt('/login')),
      })
      const unknownEmail = await postJson('/api/identity/login', {
        email: 'unknown@example.com',
        password: 'password1',
        ...(await pageAt('/login')),
      })
      const invalidCredentials = {
        ok: false,
        error: { code: 'invalid-credentials' },
      }
      expect(wrongPassword.status).toBe(401)
      expect(await wrongPassword.json()).toEqual(invalidCredentials)
      // Same status, code, and payload: callers cannot tell whether the email exists.
      expect(unknownEmail.status).toBe(wrongPassword.status)
      expect(await unknownEmail.json()).toEqual(invalidCredentials)
    }
    finally {
      await postgresWire.stop()
      await postgres.close()
    }
  })
})
