import { postgresIsReady } from '../internal/postgres'

export default defineEventHandler(async (event) => {
  // Traffic must not be sent to a Host that cannot serve. Cache would lie about that.
  setHeader(event, 'Cache-Control', 'no-store')

  const ready = await postgresIsReady(useRuntimeConfig().databaseUrl)

  if (!ready) {
    setResponseStatus(event, 503)
    return { ok: false }
  }

  return { ok: true }
})
