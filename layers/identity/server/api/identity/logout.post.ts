export default defineEventHandler(async (event) => {
  // End-session rules stay in the Identity application service, not in Pinia or this handler.
  const { identity, cookieBag } = await identityFromEvent(event)
  await identity.endSession()

  appendIdentityCookies(event, cookieBag)
  return { ok: true }
})
