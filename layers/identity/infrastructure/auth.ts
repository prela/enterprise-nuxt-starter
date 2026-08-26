import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export function createIdentityPersistence(databaseUrl: string) {
  const client = postgres(databaseUrl)
  const db = drizzle(client, { schema })
  return { client, db }
}

export function createIdentityAuth(input: {
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
