// Playground Host: extends Core, UI, and Identity through each Layer’s public interface.
export default defineNuxtConfig({
  extends: ['@starter/core', '@starter/ui', '@starter/identity'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Strict is Nuxt's default; pin it so typecheck cannot silently loosen.
  typescript: {
    strict: true,
  },
})
