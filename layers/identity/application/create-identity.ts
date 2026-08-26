import type { IdentityResult } from '../domain/identity-result'
import type { Principal, SessionToken } from '../domain/principal'
import { registerValidationError } from '../domain/register-input'
import { routeRequiresPrincipal } from '../domain/route-access'

export interface ActiveSession {
  session: SessionToken
  principal: Principal
}

export interface IdentityPort {
  register: (input: { email: string, password: string }) => Promise<IdentityResult<Principal>>
  authenticate: (input: { email: string, password: string }) => Promise<IdentityResult<ActiveSession>>
  endSession: (session: SessionToken) => Promise<void>
  currentPrincipal: (session: SessionToken | null) => Promise<Principal | null>
  mayAccessRoute: (input: { session: SessionToken | null, route: string }) => Promise<boolean>
}

interface StoredMember {
  id: string
  email: string
  password: string
}

function toPrincipal(member: StoredMember): Principal {
  return { id: member.id, email: member.email }
}

// In-memory fake behind the Identity port. The Better Auth adapter implements
// this same IdentityPort; tests never import this module’s maps.
export function createIdentity(): IdentityPort {
  const membersByEmail = new Map<string, StoredMember>()
  const membersById = new Map<string, StoredMember>()
  const sessions = new Map<SessionToken, string>()

  async function principalFor(session: SessionToken | null): Promise<Principal | null> {
    if (!session)
      return null
    const memberId = sessions.get(session)
    if (!memberId)
      return null
    const member = membersById.get(memberId)
    return member ? toPrincipal(member) : null
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
      membersById.set(member.id, member)
      return { ok: true, data: toPrincipal(member) }
    },

    async authenticate(input) {
      // Fail closed as invalid-credentials so unknown email and wrong password
      // are indistinguishable at this seam.
      const member = membersByEmail.get(input.email)
      if (!member || member.password !== input.password)
        return { ok: false, error: { code: 'invalid-credentials' } }

      const session = crypto.randomUUID()
      sessions.set(session, member.id)
      return {
        ok: true,
        data: { session, principal: toPrincipal(member) },
      }
    },

    async endSession(session) {
      sessions.delete(session)
    },

    currentPrincipal: principalFor,

    async mayAccessRoute(input) {
      if (!routeRequiresPrincipal(input.route))
        return true
      return (await principalFor(input.session)) !== null
    },
  }
}
