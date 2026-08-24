// Playground Host: extends Core and UI. Identity Layer lands in a later work package.
export default defineNuxtConfig({
  extends: ['@starter/core', '@starter/ui'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Strict is Nuxt's default; pin it so typecheck cannot silently loosen.
  typescript: {
    strict: true,
  },
})
