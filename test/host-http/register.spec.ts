import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { fetch, setup, startServer, stopServer } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))

function csrfTokenFrom(html: string): string {
  const match = html.match(/<meta name="csrf-token" content="([^"]+)">/)
  if (!match)
    throw new Error('CSRF meta tag missing from register HTML')
  return match[1]
}

function cookieHeaderFrom(response: Response): string {
  const cookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie') ?? '']
  return cookies.filter(Boolean).map(cookie => cookie.split(';')[0]).join('; ')
}

async function registerPage(): Promise<{ csrf: string, cookie: string }> {
  const response = await fetch('/register')
  const html = await response.text()
  return {
    csrf: csrfTokenFrom(html),
    cookie: cookieHeaderFrom(response),
  }
}

async function postRegister(input: {
  email: string
  password: string
  csrf: string
  cookie: string
}): Promise<Response> {
  return fetch('/api/identity/register', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'csrf-token': input.csrf,
      'cookie': input.cookie,
    },
    body: JSON.stringify({ email: input.email, password: input.password }),
  })
}

describe('host HTTP register', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
  })

  it('first paint of register is a real SSR form with email and password', async () => {
    const response = await fetch('/register')
    const html = await response.text()

    expect(response.status).toBe(200)
    // A visitor with JS off still sees a form, not an empty Identity shell.
    expect(html).toMatch(/<form\b/i)
    expect(html).toMatch(/<input[^>]*name="email"/i)
    expect(html).toMatch(/<input[^>]*name="password"/i)
    expect(html).toMatch(/<button[^>]*type="submit"|<input[^>]*type="submit"/i)
  })

  it('rejects a register POST that has no CSRF token', async () => {
    const response = await fetch('/api/identity/register', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'email=member@example.com&password=password1',
    })

    expect(response.status).toBe(403)
  })

  it('shows a field error when register email is invalid', async () => {
    const page = await registerPage()
    const response = await postRegister({
      email: 'not-an-email',
      password: 'password1',
      ...page,
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      ok: false,
      error: {
        code: 'validation',
        fields: { email: 'Email is invalid' },
      },
    })
  })

  it('shows a field error when register password is too weak', async () => {
    const page = await registerPage()
    const response = await postRegister({
      email: 'member@example.com',
      password: '1234567',
      ...page,
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      ok: false,
      error: {
        code: 'validation',
        fields: { password: 'Password is too weak' },
      },
    })
  })

  it('persists a registered member in PostgreSQL, rejects a duplicate email, and sets an httpOnly session cookie', async () => {
    const postgres = new PGlite()
    const postgresWire = new PGLiteSocketServer({
      db: postgres,
      host: '127.0.0.1',
      port: 55433,
    })
    await postgresWire.start()

    const env = {
      NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
      NUXT_DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55433/postgres',
      // Better Auth rejects short secrets; this value is test-only.
      NUXT_BETTER_AUTH_SECRET: 'test-better-auth-secret-not-for-production',
    }

    try {
      await stopServer()
      await startServer({ env })

      const page = await registerPage()
      const created = await postRegister({
        email: 'member@example.com',
        password: 'password1',
        ...page,
      })
      const createdBody = await created.json()

      expect(created.status).toBe(201)
      expect(createdBody.ok).toBe(true)
      expect(createdBody.data.email).toBe('member@example.com')
      expect(createdBody.data.id.length).toBeGreaterThan(0)

      const setCookies = typeof created.headers.getSetCookie === 'function'
        ? created.headers.getSetCookie()
        : [created.headers.get('set-cookie') ?? '']
      // Session cookie must be unreadable to page JavaScript; CSRF’s cookie is not the session.
      expect(setCookies.some(cookie =>
        /httponly/i.test(cookie)
        && !/^csrf=/i.test(cookie)
        && !/^__Host-csrf=/i.test(cookie),
      )).toBe(true)

      const duplicateOnSameProcess = await postRegister({
        email: 'member@example.com',
        password: 'password1',
        ...(await registerPage()),
      })
      expect(duplicateOnSameProcess.status).toBe(409)
      expect(await duplicateOnSameProcess.json()).toEqual({
        ok: false,
        error: { code: 'duplicate-email' },
      })

      // Restart the Host against the same PostgreSQL: the member must still exist.
      await stopServer()
      await startServer({ env })

      const duplicateAfterRestart = await postRegister({
        email: 'member@example.com',
        password: 'password1',
        ...(await registerPage()),
      })
      expect(duplicateAfterRestart.status).toBe(409)
      expect(await duplicateAfterRestart.json()).toEqual({
        ok: false,
        error: { code: 'duplicate-email' },
      })
    }
    finally {
      await postgresWire.stop()
      await postgres.close()
    }
  })
})
