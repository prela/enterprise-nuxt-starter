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

async function pageAt(path: string, cookie = ''): Promise<{ csrf: string, cookie: string, html: string, status: number }> {
  const response = await fetch(path, {
    headers: {
      accept: 'text/html',
      ...(cookie ? { cookie } : {}),
    },
  })
  const html = await response.text()
  return {
    csrf: csrfTokenFrom(html),
    cookie: cookieHeaderFrom(response),
    html,
    status: response.status,
  }
}

async function postJson(path: string, input: {
  csrf: string
  cookie: string
  email?: string
  password?: string
}): Promise<Response> {
  const body = input.email !== undefined && input.password !== undefined
    ? { email: input.email, password: input.password }
    : {}
  return fetch(path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'csrf-token': input.csrf,
      'cookie': input.cookie,
    },
    body: JSON.stringify(body),
  })
}

// Seam: Host HTTP/UI. Logout is observed as visitor HTML and a dead replayed
// cookie, not by importing Better Auth or session tables.

describe('host HTTP logout', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
  })

  it('rejects a logout POST that has no CSRF token', async () => {
    const response = await fetch('/api/identity/logout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    })

    expect(response.status).toBe(403)
  })

  it('logs a member out, treats them as a visitor, and rejects a replayed session cookie', async () => {
    const postgres = new PGlite()
    const postgresWire = new PGLiteSocketServer({
      db: postgres,
      host: '127.0.0.1',
      port: 55436,
    })
    await postgresWire.start()

    const env = {
      NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
      NUXT_DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55436/postgres',
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

      const sessionCookie = cookieHeaderFrom(loggedIn)
      const asMember = await pageAt('/protected', sessionCookie)
      expect(asMember.status).toBe(200)
      expect(asMember.html).toMatch(/Identity is working/)
      // Native logout action so a member can end the session from the page they just reached.
      expect(asMember.html).toMatch(/<form\b/i)
      expect(asMember.html).toMatch(/action="\/api\/identity\/logout"/i)
      expect(asMember.html).toMatch(/Log out/)

      const loggedOut = await postJson('/api/identity/logout', {
        csrf: asMember.csrf,
        cookie: [sessionCookie, asMember.cookie].filter(Boolean).join('; '),
      })
      expect(loggedOut.status).toBe(200)
      expect(await loggedOut.json()).toEqual({ ok: true })

      // Replay the pre-logout cookie: the server session must be gone, not only the browser jar.
      const replayed = await pageAt('/protected', sessionCookie)
      expect(replayed.html).not.toMatch(/Identity is working/)
      expect(replayed.html).toMatch(/Log in/)
      expect(replayed.html).toMatch(/<form\b/i)
      expect(replayed.html).toMatch(/<input[^>]*name="email"/i)
    }
    finally {
      await postgresWire.stop()
      await postgres.close()
    }
  })
})
