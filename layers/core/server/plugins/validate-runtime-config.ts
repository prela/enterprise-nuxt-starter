import { corePrivateConfigSchema, corePublicConfigSchema } from '../internal/runtime-config'

export default defineNitroPlugin(() => {
  // Docs prerender runs inside `pnpm build`. The Playground image does not
  // receive NUXT_DATABASE_URL until Compose starts the runner. Fail-closed
  // checks belong at process boot, not at static generation.
  if (import.meta.prerender)
    return

  // Fail closed at boot so a Coolify process never serves traffic with a broken origin.
  const config = useRuntimeConfig()
  const parsedPublic = corePublicConfigSchema.safeParse(config.public)
  if (!parsedPublic.success) {
    throw parsedPublic.error
  }

  const parsedPrivate = corePrivateConfigSchema.safeParse({ databaseUrl: config.databaseUrl })
  if (!parsedPrivate.success) {
    throw parsedPrivate.error
  }
})
