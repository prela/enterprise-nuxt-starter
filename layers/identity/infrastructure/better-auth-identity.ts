import type { IdentityPort } from '../application/create-identity'
import type { IdentityPersistenceBoot } from './auth'
import { APIError } from 'better-auth/api'
import { registerValidationError } from '../domain/register-input'
import { routeRequiresPrincipal } from '../domain/route-access'
import { bootIdentityAuth } from './auth'

export interface BetterAuthHttpContext {
  requestHeaders?: Headers
  cookieHeaders?: Headers
}

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

function copyCookies(from: Headers, to: Headers | undefined) {
  if (!to)
    return
  const cookies = typeof from.getSetCookie === 'function'
    ? from.getSetCookie()
    : [from.get('set-cookie') ?? ''].filter(Boolean)
  for (const cookie of cookies)
    to.append('set-cookie', cookie)
}

// Production adapter: same IdentityPort as the in-memory fake, Better Auth behind it.
// Persistence boot (auth-instance cache and migrate-on-demand) lives here, not in the Nitro bind.
export function createBetterAuthIdentity(
  boot: IdentityPersistenceBoot,
  http: BetterAuthHttpContext = {},
): IdentityPort {
  const { auth, ensureReady } = bootIdentityAuth(boot)
  async function principalFor(session: string | null) {
    if (!session)
      return null
    const headers = new Headers(http.requestHeaders)
    if (!headers.has('cookie'))
      headers.set('cookie', `better-auth.session_token=${session}`)
    const current = await auth.api.getSession({ headers })
    if (!current?.user)
      return null
    return { id: current.user.id, email: current.user.email }
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
          headers: http.requestHeaders ?? new Headers(),
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
        copyCookies(response.headers, http.cookieHeaders)
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
      const member = await auth.api.signInEmail({
        body: { email: input.email, password: input.password },
        headers: http.requestHeaders ?? new Headers(),
        asResponse: true,
      }).catch(() => null)

      if (!member || !member.ok)
        return { ok: false, error: { code: 'invalid-credentials' } }

      const payload = await member.json() as {
        user?: { id: string, email: string }
        token?: string | null
      }
      if (!payload.user)
        return { ok: false, error: { code: 'invalid-credentials' } }

      copyCookies(member.headers, http.cookieHeaders)
      return {
        ok: true,
        data: {
          session: payload.token ?? '',
          principal: { id: payload.user.id, email: payload.user.email },
        },
      }
    },

    async endSession(session) {
      await ensureReady()
      const headers = new Headers(http.requestHeaders)
      if (!headers.has('cookie'))
        headers.set('cookie', `better-auth.session_token=${session}`)
      const response = await auth.api.signOut({
        headers,
        asResponse: true,
      })
      copyCookies(response.headers, http.cookieHeaders)
    },

    currentPrincipal: principalFor,

    async mayAccessRoute(input) {
      if (!routeRequiresPrincipal(input.route))
        return true
      return (await principalFor(input.session)) !== null
    },
  }
}
