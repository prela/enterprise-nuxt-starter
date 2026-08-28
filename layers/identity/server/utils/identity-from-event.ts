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
// Vendor cookie names stay inside that adapter; this bind copies the bag only.
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

  const cookieBag = new Headers()
  const cookie = getHeader(event, 'cookie')
  if (cookie)
    cookieBag.set('cookie', cookie)

  const identity = createBetterAuthIdentity({
    databaseUrl: parsed.data.databaseUrl,
    secret: parsed.data.betterAuthSecret,
    baseURL: parsed.data.siteUrl,
    migrationsFolder: parsed.data.identityMigrationsFolder,
  }, cookieBag)
  return { identity, cookieBag }
}

export async function currentPrincipalFromEvent(event: H3Event) {
  const { identity } = await identityFromEvent(event)
  return identity.currentPrincipal()
}

export function appendIdentityCookies(event: H3Event, cookieBag: Headers) {
  const cookies = typeof cookieBag.getSetCookie === 'function'
    ? cookieBag.getSetCookie()
    : [cookieBag.get('set-cookie') ?? ''].filter(Boolean)
  for (const cookie of cookies)
    appendResponseHeader(event, 'set-cookie', cookie)
}
