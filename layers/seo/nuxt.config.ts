// SEO Nuxt Layer defaults. Products extend this package; they do not deep-import Tiers.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // This Layer does not `extends` i18n, content, Identity, or UI.
  // Origin is Core’s NUXT_PUBLIC_SITE_URL when the Host also extends Core — no NUXT_SITE_URL.
  modules: ['@nuxtjs/seo'],
  // Robots default to indexable. Hosts noindex routes with routeRules.robots (see README).
  // Sitemap defaults to discovered routes. Hosts exclude paths in their own config.
  // Open Graph / canonical tags come from Nuxt SEO utils; Hosts set page title and description.
})
