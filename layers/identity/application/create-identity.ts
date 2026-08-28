import type { IdentityResult } from '../domain/identity-result'
import type { Principal } from '../domain/principal'
import { registerValidationError } from '../domain/register-input'
import { routeRequiresPrincipal } from '../domain/route-access'

export interface IdentityPort {
  register: (input: { email: string, password: string }) => Promise<IdentityResult<Principal>>
  authenticate: (input: { email: string, password: string }) => Promise<IdentityResult<Principal>>
  endSession: () => Promise<void>
  currentPrincipal: () => Promise<Principal | null>
  mayAccessRoute: (route: string) => Promise<boolean>
}

interface StoredMember {
  id: string
  email: string
  password: string
}

// Identity’s Session cookie. Vendor names (Better Auth, __Secure-) stay in that adapter.
const SESSION_COOKIE = 'identity.session'

function sessionFromBag(bag: Headers): string | null {
  // Last write wins: inbound Cookie, then each Set-Cookie. An empty value is a cleared Session.
  let found: string | null = null
  const inbound = bag.get('cookie')
  const pairs = [
    ...(inbound ? inbound.split(';').map(part => part.trim()) : []),
    ...bag.getSetCookie().map(cookie => cookie.split(';')[0].trim()),
  ]
  for (const pair of pairs) {
    const eq = pair.indexOf('=')
    if (eq < 0)
      continue
    if (pair.slice(0, eq).trim() !== SESSION_COOKIE)
      continue
    const value = pair.slice(eq + 1).trim()
    found = value.length > 0 ? value : null
  }
  return found
}

function toPrincipal(member: StoredMember): Principal {
  return { id: member.id, email: member.email }
}

function appendSessionCookie(bag: Headers, session: string) {
  bag.append('set-cookie', `${SESSION_COOKIE}=${session}; Path=/; HttpOnly; SameSite=Lax`)
}

function clearSessionCookie(bag: Headers) {
  bag.append('set-cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}

// In-memory fake behind the Identity port. The Better Auth adapter implements
// this same IdentityPort; tests never import this module’s maps.
export function createIdentity(cookieBag: Headers = new Headers()): IdentityPort {
  const membersByEmail = new Map<string, StoredMember>()
  // Session id → principal. The fake never keeps a session without a member,
  // so currentPrincipal does not need a second lookup that cannot miss.
  const sessions = new Map<string, Principal>()

  async function principalFor(): Promise<Principal | null> {
    const session = sessionFromBag(cookieBag)
    if (!session)
      return null
    return sessions.get(session) ?? null
  }

  function startSession(principal: Principal) {
    const session = crypto.randomUUID()
    sessions.set(session, principal)
    appendSessionCookie(cookieBag, session)
  }

  return {
    async register(input) {
      const validation = registerValidationError(input.email, input.password)
      if (validation)
        return { ok: false, error: validation }

      if (membersByEmail.has(input.email))
        return { ok: false, error: { code: 'duplicate-email' } }

      const member: StoredMember = {
        id: crypto.randomUUID(),
        email: input.email,
        password: input.password,
      }
      membersByEmail.set(member.email, member)
      const principal = toPrincipal(member)
      startSession(principal)
      return { ok: true, data: principal }
    },

    async authenticate(input) {
      // Fail closed as invalid-credentials so unknown email and wrong password
      // are indistinguishable at this seam.
      const member = membersByEmail.get(input.email)
      if (!member || member.password !== input.password)
        return { ok: false, error: { code: 'invalid-credentials' } }

      const principal = toPrincipal(member)
      startSession(principal)
      return { ok: true, data: principal }
    },

    async endSession() {
      const session = sessionFromBag(cookieBag)
      if (session)
        sessions.delete(session)
      clearSessionCookie(cookieBag)
    },

    currentPrincipal: principalFor,

    async mayAccessRoute(route) {
      if (!routeRequiresPrincipal(route))
        return true
      return (await principalFor()) !== null
    },
  }
}
