import type { IdentityPort } from '../application/create-identity'
import type { IdentityPersistenceBoot } from './auth'
import { APIError } from 'better-auth/api'
import { registerValidationError } from '../domain/register-input'
import { routeRequiresPrincipal } from '../domain/route-access'
import { bootIdentityAuth } from './auth'

function isDuplicateEmailCode(code: string | undefined): boolean {
  return String(code ?? '').includes('USER_ALREADY_EXISTS')
}

function isDuplicateEmailPayload(payload: { error?: { code?: string, message?: string }, code?: string, message?: string }): boolean {
  const code = payload.error?.code ?? payload.code
  const message = payload.error?.message ?? payload.message
  return isDuplicateEmailCode(code) || /already exists/i.test(String(message ?? ''))
}

function isDuplicateEmail(error: unknown): boolean {
  if (!(error instanceof APIError))
    return false
  const body = error.body as { code?: string } | undefined
  return isDuplicateEmailCode(body?.code ?? error.message) || /already exists/i.test(String(error.message))
}

function setCookieList(bag: Headers): string[] {
  if (typeof bag.getSetCookie === 'function')
    return bag.getSetCookie()
  const single = bag.get('set-cookie')
  return single ? [single] : []
}

function copyCookies(from: Headers, to: Headers) {
  for (const cookie of setCookieList(from))
    to.append('set-cookie', cookie)
}

// Cookie header plus this bag’s Set-Cookie name=value pairs so register then
// currentPrincipal on the same bag sees the Session without a second request.
function cookiesForRequest(bag: Headers): string {
  const inbound = bag.get('cookie') ?? ''
  const fromSet = setCookieList(bag).map(cookie => (cookie.split(';')[0] ?? '').trim()).filter(Boolean)
  return [inbound, ...fromSet].filter(Boolean).join('; ')
}

function betterAuthHeaders(cookieBag: Headers, baseURL: string): Headers {
  const headers = new Headers()
  headers.set('origin', baseURL)
  const cookies = cookiesForRequest(cookieBag)
  if (cookies)
    headers.set('cookie', cookies)
  return headers
}

// Production adapter: same IdentityPort as the in-memory fake, Better Auth behind it.
// Persistence boot (auth-instance cache and migrate-on-demand) lives here, not in the Nitro bind.
// Vendor cookie names (including __Secure-) stay inside Better Auth; this adapter copies the bag.
export function createBetterAuthIdentity(
  boot: IdentityPersistenceBoot,
  cookieBag: Headers = new Headers(),
): IdentityPort {
  const { auth, ensureReady } = bootIdentityAuth(boot)

  async function principalFor() {
    const headers = betterAuthHeaders(cookieBag, boot.baseURL)
    // No Cookie means no Session; skip the engine so public /protected probes
    // do not need Identity persistence (Core /health never reaches here).
    if (!headers.has('cookie'))
      return null
    try {
      const current = await auth.api.getSession({ headers })
      if (!current?.user)
        return null
      return { id: current.user.id, email: current.user.email }
    }
    catch {
      return null
    }
  }

  return {
    async register(input) {
      const validation = registerValidationError(input.email, input.password)
      if (validation)
        return { ok: false, error: validation }

      await ensureReady()

      try {
        const response = await auth.api.signUpEmail({
          body: {
            name: input.email,
            email: input.email,
            password: input.password,
          },
          headers: betterAuthHeaders(cookieBag, boot.baseURL),
          asResponse: true,
        })

        const payload = await response.json() as {
          user?: { id: string, email: string }
          error?: { code?: string }
        }
        if (!response.ok || !payload.user) {
          if (response.status === 422 || isDuplicateEmailPayload(payload))
            return { ok: false, error: { code: 'duplicate-email' } }
          throw new Error('Better Auth register failed')
        }
        copyCookies(response.headers, cookieBag)
        return { ok: true, data: { id: payload.user.id, email: payload.user.email } }
      }
      catch (error) {
        if (isDuplicateEmail(error))
          return { ok: false, error: { code: 'duplicate-email' } }
        throw error
      }
    },

    async authenticate(input) {
      await ensureReady()
      const signIn = await auth.api.signInEmail({
        body: { email: input.email, password: input.password },
        headers: betterAuthHeaders(cookieBag, boot.baseURL),
        asResponse: true,
      }).catch(() => null)

      if (!signIn || !signIn.ok)
        return { ok: false, error: { code: 'invalid-credentials' } }

      const payload = await signIn.json() as {
        user?: { id: string, email: string }
      }
      if (!payload.user)
        return { ok: false, error: { code: 'invalid-credentials' } }

      copyCookies(signIn.headers, cookieBag)
      return {
        ok: true,
        data: { id: payload.user.id, email: payload.user.email },
      }
    },

    async endSession() {
      await ensureReady()
      const response = await auth.api.signOut({
        headers: betterAuthHeaders(cookieBag, boot.baseURL),
        asResponse: true,
      })
      copyCookies(response.headers, cookieBag)
    },

    currentPrincipal: principalFor,

    async mayAccessRoute(route) {
      if (!routeRequiresPrincipal(route))
        return true
      return (await principalFor()) !== null
    },
  }
}
