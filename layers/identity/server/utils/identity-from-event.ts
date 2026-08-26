import type { H3Event } from 'h3'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { appendResponseHeader } from 'h3'
import { z } from 'zod'
import { createIdentityAuth } from '#layers/identity/infrastructure/auth'
import { createBetterAuthIdentity } from '#layers/identity/infrastructure/better-auth-identity'

const identitySecretSchema = z.object({
  betterAuthSecret: z.string().min(32),
  databaseUrl: z.string().url(),
  siteUrl: z.string().url(),
  identityMigrationsFolder: z.string(),
})

const migratedUrls = new Set<string>()
const authByUrl = new Map<string, ReturnType<typeof createIdentityAuth>>()

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

export async function identityFromEvent(event: H3Event) {
  const config = useRuntimeConfig(event)
  const parsed = identitySecretSchema.safeParse({
    betterAuthSecret: config.betterAuthSecret,
    databaseUrl: config.databaseUrl,
    siteUrl: config.public.siteUrl,
    identityMigrationsFolder: config.identityMigrationsFolder,
  })
  if (!parsed.success)
    throw parsed.error

  const cookieHeaders = new Headers()
  const requestHeaders = new Headers(event.headers)
  if (!requestHeaders.has('origin'))
    requestHeaders.set('origin', parsed.data.siteUrl)

  const created = persistenceFor(
    parsed.data.databaseUrl,
    parsed.data.betterAuthSecret,
    parsed.data.siteUrl,
  )
  const identity = createBetterAuthIdentity(created.auth, {
    requestHeaders,
    cookieHeaders,
    ensureReady: () => ensureMigrated(parsed.data.databaseUrl, parsed.data.identityMigrationsFolder),
  })
  return { identity, cookieHeaders }
}

export function sessionTokenFromEvent(event: H3Event): string | null {
  return getCookie(event, 'better-auth.session_token') ?? null
}

export async function currentPrincipalFromEvent(event: H3Event) {
  const session = sessionTokenFromEvent(event)
  if (!session)
    return null
  const { identity } = await identityFromEvent(event)
  return identity.currentPrincipal(session)
}

export function appendIdentityCookies(event: H3Event, cookieHeaders: Headers) {
  const cookies = typeof cookieHeaders.getSetCookie === 'function'
    ? cookieHeaders.getSetCookie()
    : [cookieHeaders.get('set-cookie') ?? ''].filter(Boolean)
  for (const cookie of cookies)
    appendResponseHeader(event, 'set-cookie', cookie)
}
