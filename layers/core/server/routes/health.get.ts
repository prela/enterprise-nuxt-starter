export default defineEventHandler((event) => {
  // Probes must observe the live process. A cached 200 would hide a dead Host.
  setHeader(event, 'Cache-Control', 'no-store')
  return { ok: true }
})
