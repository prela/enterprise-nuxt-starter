import { createIdentity } from '@starter/identity/port'
import { describe, expect, it } from 'vitest'

// Seam: Identity Public Layer interface (register, authenticate, end session,
// current principal, may-access-route). Tests never import Tiers or the fake.

describe('identity port', () => {
  it('registers a member with email and password', async () => {
    const identity = createIdentity()

    const result = await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })

    expect(result.ok).toBe(true)
    if (!result.ok)
      return
    expect(result.data.email).toBe('member@example.com')
    expect(result.data.id.length).toBeGreaterThan(0)
  })

  it('rejects an invalid email on register', async () => {
    const identity = createIdentity()

    const result = await identity.register({
      email: 'not-an-email',
      password: 'password1',
    })

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'validation',
        fields: { email: expect.any(String) },
      },
    })
  })

  it('rejects a weak password on register', async () => {
    const identity = createIdentity()

    const result = await identity.register({
      email: 'member@example.com',
      password: '1234567',
    })

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'validation',
        fields: { password: expect.any(String) },
      },
    })
  })

  it('rejects a second register with the same email', async () => {
    const identity = createIdentity()
    const input = { email: 'member@example.com', password: 'password1' }

    await identity.register(input)
    const result = await identity.register(input)

    expect(result).toEqual({
      ok: false,
      error: { code: 'duplicate-email' },
    })
  })

  it('authenticates a registered member with email and password', async () => {
    const identity = createIdentity()
    await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })

    const result = await identity.authenticate({
      email: 'member@example.com',
      password: 'password1',
    })

    expect(result.ok).toBe(true)
    if (!result.ok)
      return
    expect(result.data.principal.email).toBe('member@example.com')
    expect(result.data.session.length).toBeGreaterThan(0)
  })

  it('returns the same invalid-credentials error for a wrong password and an unknown email', async () => {
    const identity = createIdentity()
    await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })

    const wrongPassword = await identity.authenticate({
      email: 'member@example.com',
      password: 'wrong-password',
    })
    const unknownEmail = await identity.authenticate({
      email: 'unknown@example.com',
      password: 'password1',
    })

    expect(wrongPassword).toEqual({
      ok: false,
      error: { code: 'invalid-credentials' },
    })
    // Same code and payload: callers cannot tell whether the email exists.
    expect(unknownEmail).toEqual(wrongPassword)
  })

  it('returns the principal for an authenticated session', async () => {
    const identity = createIdentity()
    await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })
    const authenticated = await identity.authenticate({
      email: 'member@example.com',
      password: 'password1',
    })
    expect(authenticated.ok).toBe(true)
    if (!authenticated.ok)
      return

    const principal = await identity.currentPrincipal(authenticated.data.session)

    expect(principal).toEqual({
      id: authenticated.data.principal.id,
      email: 'member@example.com',
    })
  })

  it('forgets the principal after the session ends', async () => {
    const identity = createIdentity()
    await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })
    const authenticated = await identity.authenticate({
      email: 'member@example.com',
      password: 'password1',
    })
    expect(authenticated.ok).toBe(true)
    if (!authenticated.ok)
      return

    await identity.endSession(authenticated.data.session)

    expect(await identity.currentPrincipal(authenticated.data.session)).toBeNull()
  })

  it('allows an authenticated member to access a protected route and denies an anonymous visitor', async () => {
    const identity = createIdentity()
    const route = '/protected'

    expect(await identity.mayAccessRoute({ session: null, route })).toBe(false)
    expect(await identity.mayAccessRoute({ session: null, route: '/' })).toBe(true)

    await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })
    const authenticated = await identity.authenticate({
      email: 'member@example.com',
      password: 'password1',
    })
    expect(authenticated.ok).toBe(true)
    if (!authenticated.ok)
      return

    expect(await identity.mayAccessRoute({
      session: authenticated.data.session,
      route,
    })).toBe(true)
  })
})
