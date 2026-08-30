// Docs-shaped omit fixture: Core, UI, content, seo, i18n. No Identity.
// CI-only Host; never deployed (ADR-0007). Not a second Playground.
export default defineNuxtConfig({
  extends: [
    '@starter/core',
    '@starter/ui',
    '@starter/content',
    '@starter/seo',
    '@starter/i18n',
  ],
  compatibilityDate: '2025-07-15',
})
