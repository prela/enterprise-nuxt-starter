import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dockerfile = readFileSync(
  fileURLToPath(new URL('../../Dockerfile', import.meta.url)),
  'utf8',
)
const corePlugin = readFileSync(
  fileURLToPath(new URL('../../layers/core/server/plugins/validate-runtime-config.ts', import.meta.url)),
  'utf8',
)
const identityPlugin = readFileSync(
  fileURLToPath(new URL('../../layers/identity/server/plugins/validate-identity-config.ts', import.meta.url)),
  'utf8',
)

/** Nitro replaces this flag in the prerender worker; the skip is an `if` that returns. */
function returnsEarlyOnPrerender(source: string): boolean {
  return /if\s*\(\s*import\.meta\.prerender\s*\)\s*return/.test(source)
}

describe('docker pnpm build prerender', () => {
  it('does not bake NUXT_DATABASE_URL into the image build stage', () => {
    // Compose injects the Postgres URL at runner start. A build-stage ENV would
    // hide a missing runtime secret and still leave prerender talking to nothing.
    expect(dockerfile).toMatch(/ENV NUXT_PUBLIC_SITE_URL=http:\/\/localhost:3000/)
    expect(dockerfile).not.toMatch(/^\s*ENV NUXT_DATABASE_URL=/m)
    expect(dockerfile).not.toMatch(/^\s*ENV NUXT_BETTER_AUTH_SECRET=/m)
  })

  it('skips Core fail-closed env checks while Nitro prerenders docs', () => {
    // Coolify `RUN pnpm build` has no NUXT_DATABASE_URL. The Core plugin used to
    // throw Zod invalid_format / "must be a PostgreSQL URL" at prerender init.
    expect(returnsEarlyOnPrerender(corePlugin)).toBe(true)
  })

  it('skips Identity fail-closed env checks while Nitro prerenders docs', () => {
    // Same Docker stage omits NUXT_BETTER_AUTH_SECRET. Skipping only Core would
    // fail next on betterAuthSecret min(32) during prerender init.
    expect(returnsEarlyOnPrerender(identityPlugin)).toBe(true)
  })
})
