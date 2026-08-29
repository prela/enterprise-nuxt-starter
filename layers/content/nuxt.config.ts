// Content Nuxt Layer defaults. Products extend this package; they do not deep-import Tiers.
// Catalogue Layers do not extends each other; the Host composes them.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/content'],
  content: {
    // Starter runtime is Node 22. Native node:sqlite avoids better-sqlite3 builds on Alpine/pnpm.
    experimental: {
      sqliteConnector: 'native',
    },
  },
  // Content’s query API is a same-origin POST. Core CSRF must not treat it as an Identity mutation.
  routeRules: {
    '/__nuxt_content/**': { csurf: false } as never,
  },
})
