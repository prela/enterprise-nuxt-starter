import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as schema from './schema'

export interface IdentityPersistenceBoot {
  databaseUrl: string
  secret: string
  baseURL: string
  migrationsFolder: string
}

// One engine per database URL so each request does not open a new postgres client.
const authByUrl = new Map<string, ReturnType<typeof createIdentityAuth>>()
const migratedUrls = new Set<string>()

function createIdentityPersistence(databaseUrl: string) {
  const client = postgres(databaseUrl)
  const db = drizzle(client, { schema })
  return { client, db }
}

function createIdentityAuth(input: {
  databaseUrl: string
  secret: string
  baseURL: string
}) {
  const persistence = createIdentityPersistence(input.databaseUrl)

  const auth = betterAuth({
    secret: input.secret,
    baseURL: input.baseURL,
    trustedOrigins: [input.baseURL],
    database: drizzleAdapter(persistence.db, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    advanced: {
      // Playground and Host HTTP tests speak HTTP; production HTTPS still sets Secure.
      useSecureCookies: input.baseURL.startsWith('https://'),
    },
  })

  return { ...persistence, auth }
}

function persistenceFor(databaseUrl: string, secret: string, baseURL: string) {
  const cached = authByUrl.get(databaseUrl)
  if (cached)
    return cached

  const created = createIdentityAuth({ databaseUrl, secret, baseURL })
  authByUrl.set(databaseUrl, created)
  return created
}

async function ensureMigrated(databaseUrl: string, migrationsFolder: string) {
  if (migratedUrls.has(databaseUrl))
    return
  const created = authByUrl.get(databaseUrl)
  if (!created)
    return
  await migrate(created.db, {
    migrationsFolder: migrationsFolder || 'layers/identity/drizzle',
  })
  migratedUrls.add(databaseUrl)
}

// Cached engine plus migrate-on-demand. Construction does not migrate so
// public routes that never call register/authenticate/endSession stay off
// Identity persistence (Core /health must not become an Identity client).
export function bootIdentityAuth(input: IdentityPersistenceBoot) {
  const created = persistenceFor(input.databaseUrl, input.secret, input.baseURL)
  return {
    auth: created.auth,
    ensureReady: () => ensureMigrated(input.databaseUrl, input.migrationsFolder),
  }
}
