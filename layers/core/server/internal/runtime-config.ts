import { z } from 'zod'

// Public Host env. Products must set NUXT_PUBLIC_SITE_URL; Core does not guess a site origin.
export const corePublicConfigSchema = z.object({
  siteUrl: z.string().url(),
})

// Persistence is PostgreSQL only (ADR-0003). A MySQL URL must not boot.
export const corePrivateConfigSchema = z.object({
  databaseUrl: z.string().url().refine(
    value => value.startsWith('postgres://') || value.startsWith('postgresql://'),
    { message: 'NUXT_DATABASE_URL must be a PostgreSQL URL' },
  ),
})
