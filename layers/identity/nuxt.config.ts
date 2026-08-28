// Identity Nuxt Layer. Products extend this package; they do not deep-import Tiers.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    // Overridden by NUXT_BETTER_AUTH_SECRET. Better Auth needs 32+ characters.
    betterAuthSecret: '',
    // Overridden by NUXT_IDENTITY_MIGRATIONS_FOLDER. Empty means repo-relative default.
    identityMigrationsFolder: '',
  },
})
