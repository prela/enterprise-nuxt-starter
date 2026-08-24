export default defineEventHandler((event) => {
  // Traffic must not be sent to a Host that cannot serve. Cache would lie about that.
  setHeader(event, 'Cache-Control', 'no-store')
  return { ok: true }
})
