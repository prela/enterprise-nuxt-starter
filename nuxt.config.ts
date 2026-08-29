// Playground Host: extends every shipped Layer through each Layer’s public interface.
export default defineNuxtConfig({
  extends: [
    '@starter/core',
    '@starter/ui',
    '@starter/identity',
    '@starter/i18n',
    '@starter/content',
    '@starter/seo',
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Strict is Nuxt's default; pin it so typecheck cannot silently loosen.
  typescript: {
    strict: true,
  },
  i18n: {
    // Host-owned locale. The i18n Layer already registers English.
    locales: [
      { code: 'hr', language: 'hr', name: 'Hrvatski' },
    ],
  },
  routeRules: {
    // Identity-era `/hr` is not a translated marketing home.
    '/hr': { redirect: { to: '/hr/docs', statusCode: 302 } },
    // Hybrid rendering: docs are static; Identity stays SSR.
    '/docs': { prerender: true },
    '/docs/**': { prerender: true },
    '/hr/docs': { prerender: true },
    '/hr/docs/**': { prerender: true },
    '/login': { robots: false },
    '/register': { robots: false },
    '/protected': { robots: false },
  },
  nitro: {
    prerender: {
      // Do not crawl: home links to Identity, which must stay SSR with a live CSRF token.
      routes: [
        '/docs',
        '/docs/getting-started',
        '/docs/layers',
        // Locale chrome links to `/hr`; prerender the redirect so link inspection is not 404.
        '/hr',
        '/hr/docs',
        '/hr/docs/getting-started',
        '/hr/docs/layers',
      ],
    },
  },
  hooks: {
    // Identity does not depend on i18n; keep /login, /register, /protected unprefixed.
    'pages:extend': (pages) => {
      for (const page of pages) {
        if (page.path === '/login' || page.path === '/register' || page.path === '/protected')
          page.meta = { ...page.meta, i18n: false }
      }
    },
  },
})
