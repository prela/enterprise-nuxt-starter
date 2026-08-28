import type { H3Event } from 'h3'
import { appendResponseHeader } from 'h3'
import { z } from 'zod'
import { createBetterAuthIdentity } from '#layers/identity/infrastructure/better-auth-identity'

const identitySecretSchema = z.object({
  betterAuthSecret: z.string().min(32),
  databaseUrl: z.string().url(),
  siteUrl: z.string().url(),
  identityMigrationsFolder: z.string(),
})

// Nitro bind: parse config, attach this request’s cookies, return the port.
// Auth-instance cache and migrate-on-demand live in the Better Auth adapter.
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

  const identity = createBetterAuthIdentity({
    databaseUrl: parsed.data.databaseUrl,
    secret: parsed.data.betterAuthSecret,
    baseURL: parsed.data.siteUrl,
    migrationsFolder: parsed.data.identityMigrationsFolder,
  }, {
    requestHeaders,
    cookieHeaders,
  })
  return { identity, cookieHeaders }
}

export function sessionTokenFromEvent(event: H3Event): string | null {
  // HTTPS (Playground preview) prefixes the session cookie; HTTP Host tests do not.
  return getCookie(event, '__Secure-better-auth.session_token')
    ?? getCookie(event, 'better-auth.session_token')
    ?? null
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
