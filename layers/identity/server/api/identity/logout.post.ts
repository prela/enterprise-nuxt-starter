export default defineEventHandler(async (event) => {
  // End-session rules stay in the Identity application service, not in Pinia or this handler.
  const { identity, cookieHeaders } = await identityFromEvent(event)
  const session = sessionTokenFromEvent(event)
  if (session)
    await identity.endSession(session)

  appendIdentityCookies(event, cookieHeaders)
  return { ok: true }
})
