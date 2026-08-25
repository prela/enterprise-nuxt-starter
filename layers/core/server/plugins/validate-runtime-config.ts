import { corePrivateConfigSchema, corePublicConfigSchema } from '../internal/runtime-config'

export default defineNitroPlugin(() => {
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
