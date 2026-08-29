// i18n Nuxt Layer defaults. Products extend this package; they do not deep-import Tiers.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/i18n'],
  i18n: {
    // English is the default locale so unprefixed URLs stay the home market.
    defaultLocale: 'en',
    // Other locales (added by the Host) get a prefix; English does not.
    strategy: 'prefix_except_default',
    // Keep unprefixed English URLs stable; Hosts may enable detection when they add locales.
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'en',
        // BCP 47 tag for html lang / hreflang. Hosts append further locales by merge.
        language: 'en',
        name: 'English',
      },
    ],
  },
})
