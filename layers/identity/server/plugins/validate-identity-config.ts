import { z } from 'zod'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const parsed = z.object({
    betterAuthSecret: z.string().min(32, 'NUXT_BETTER_AUTH_SECRET must be at least 32 characters'),
  }).safeParse({ betterAuthSecret: config.betterAuthSecret })
  if (!parsed.success)
    throw parsed.error
})
