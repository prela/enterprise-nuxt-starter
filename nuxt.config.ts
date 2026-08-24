// Playground Host: extends Core. UI and Identity Layers land in later work packages.
export default defineNuxtConfig({
  extends: ['@starter/core'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Strict is Nuxt's default; pin it so typecheck cannot silently loosen.
  typescript: {
    strict: true,
  },
})
