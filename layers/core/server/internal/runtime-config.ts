import { z } from 'zod'

// Public Host env. Products must set NUXT_PUBLIC_SITE_URL; Core does not guess a site origin.
export const corePublicConfigSchema = z.object({
  siteUrl: z.string().url(),
})
