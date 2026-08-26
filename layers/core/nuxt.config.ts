// Core Nuxt Layer defaults. Products extend this package; they do not deep-import Tiers.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['nuxt-security'],
  runtimeConfig: {
    // Overridden by NUXT_DATABASE_URL at runtime.
    databaseUrl: '',
    public: {
      // Overridden by NUXT_PUBLIC_SITE_URL. Empty so a missing env cannot look valid.
      siteUrl: '',
    },
  },
  security: {
    // Report-only first: Playground scripts must load while we observe violations.
    contentSecurityPolicyReportOnly: true,
    // Identity-changing POSTs (register, later login/logout) must not succeed from another origin.
    // Core owns nuxt-security; this switch is required by the register action in the Host that extends Identity.
    csrf: true,
  },
})
