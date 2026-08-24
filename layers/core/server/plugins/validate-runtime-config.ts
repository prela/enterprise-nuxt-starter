import { corePublicConfigSchema } from '../internal/runtime-config'

export default defineNitroPlugin(() => {
  // Fail closed at boot so a Coolify process never serves traffic with a broken origin.
  const parsed = corePublicConfigSchema.safeParse(useRuntimeConfig().public)
  if (!parsed.success) {
    throw parsed.error
  }
})
