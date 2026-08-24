// Host config only: Nuxt Layers and Core defaults land in later work packages.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Strict is Nuxt's default; pin it so typecheck cannot silently loosen.
  typescript: {
    strict: true,
  },
})
