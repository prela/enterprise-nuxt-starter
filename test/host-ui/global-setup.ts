import process from 'node:process'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'

// Distinct from Host HTTP Vitest PGlite ports (55432–55436) so the two
// runners can share a machine without stealing each other's wire listener.
const PGLITE_PORT = 55437

export const playgroundEnv = {
  NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
  NUXT_DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${PGLITE_PORT}/postgres`,
  // Better Auth rejects short secrets; this value is test-only.
  NUXT_BETTER_AUTH_SECRET: 'test-better-auth-secret-not-for-production',
}

/**
 * Playwright global setup. Starts an in-process PostgreSQL-wire listener so
 * the Host HTTP/UI seam can register a member without Docker Compose.
 * Returns Playwright's teardown hook so the listener does not leak.
 */
export default async function globalSetup() {
  const postgres = new PGlite()
  const postgresWire = new PGLiteSocketServer({
    db: postgres,
    host: '127.0.0.1',
    port: PGLITE_PORT,
  })
  await postgresWire.start()

  for (const [key, value] of Object.entries(playgroundEnv))
    process.env[key] = value

  return async () => {
    await postgresWire.stop()
    await postgres.close()
  }
}
