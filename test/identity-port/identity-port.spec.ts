import { createIdentity } from '@starter/identity/port'
import { describe, expect, it } from 'vitest'

// Seam: Identity Public Layer interface (register, authenticate, end session,
// current principal, may-access-route). Tests never import Tiers or the fake.
// Session is the cookie bag, not a token on the payload.

function httpOnlySessionCookies(bag: Headers): string[] {
  const cookies = typeof bag.getSetCookie === 'function'
    ? bag.getSetCookie()
    : [bag.get('set-cookie') ?? ''].filter(Boolean)
  // Session cookie must be unreadable to page JavaScript; CSRF’s cookie is not the session.
  return cookies.filter((cookie) => {
    if (!/httponly/i.test(cookie) || /^csrf=/i.test(cookie) || /^__Host-csrf=/i.test(cookie))
      return false
    const nameValue = cookie.split(';')[0] ?? ''
    const value = nameValue.slice(nameValue.indexOf('=') + 1).trim()
    return value.length > 0
  })
}

describe('identity port', () => {
  it('registers a member, starts a Session, and allows /protected without a separate authenticate', async () => {
    const cookies = new Headers()
    const identity = createIdentity(cookies)

    const result = await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })

    expect(result.ok).toBe(true)
    if (!result.ok)
      return
    expect(result.data.email).toBe('member@example.com')
    expect(result.data.id.length).toBeGreaterThan(0)
    expect(httpOnlySessionCookies(cookies).length).toBeGreaterThan(0)
    expect(await identity.currentPrincipal()).toEqual({
      id: result.data.id,
      email: 'member@example.com',
    })
    expect(await identity.mayAccessRoute('/protected')).toBe(true)
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

  it('authenticates a registered member and starts a Session', async () => {
    const cookies = new Headers()
    const identity = createIdentity(cookies)
    await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })
    await identity.endSession()

    const result = await identity.authenticate({
      email: 'member@example.com',
      password: 'password1',
    })

    expect(result.ok).toBe(true)
    if (!result.ok)
      return
    expect(result.data.email).toBe('member@example.com')
    expect(result.data.id.length).toBeGreaterThan(0)
    expect(httpOnlySessionCookies(cookies).length).toBeGreaterThan(0)
    expect(await identity.currentPrincipal()).toEqual({
      id: result.data.id,
      email: 'member@example.com',
    })
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

  it('forgets the Principal after the Session ends', async () => {
    const identity = createIdentity()
    await identity.register({
      email: 'member@example.com',
      password: 'password1',
    })

    await identity.endSession()

    expect(await identity.currentPrincipal()).toBeNull()
    expect(await identity.mayAccessRoute('/protected')).toBe(false)
  })

  it('allows / and /login without a Principal and denies /protected', async () => {
    const identity = createIdentity()

    expect(await identity.mayAccessRoute('/')).toBe(true)
    expect(await identity.mayAccessRoute('/login')).toBe(true)
    expect(await identity.mayAccessRoute('/protected')).toBe(false)
    expect(await identity.mayAccessRoute('/protected/settings')).toBe(false)
  })

  it('does not treat non-Session cookies as a Principal', async () => {
    const cookies = new Headers()
    cookies.set('cookie', 'csrf=abc; flags')
    const identity = createIdentity(cookies)

    expect(await identity.currentPrincipal()).toBeNull()
    expect(await identity.mayAccessRoute('/protected')).toBe(false)

    await identity.endSession()
    expect(await identity.currentPrincipal()).toBeNull()
  })
})
