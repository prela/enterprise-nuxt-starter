import { z } from 'zod'

export default defineNitroPlugin(() => {
  // Same Docker `pnpm build` stage omits NUXT_BETTER_AUTH_SECRET. Skipping only
  // Core would fail next on betterAuthSecret min(32) during prerender init.
  if (import.meta.prerender)
    return

  const config = useRuntimeConfig()
  const parsed = z.object({
    betterAuthSecret: z.string().min(32, 'NUXT_BETTER_AUTH_SECRET must be at least 32 characters'),
  }).safeParse({ betterAuthSecret: config.betterAuthSecret })
  if (!parsed.success)
    throw parsed.error
})
