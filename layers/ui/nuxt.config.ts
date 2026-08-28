import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// UI Nuxt Layer defaults. Products extend this package; they do not deep-import Tiers.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui'],
  // Layer-relative: `~/` would resolve to the Host, not this package.
  css: [resolve('./app/assets/css/main.css')],
  ui: {
    // v1 excludes a fonts programme; Nuxt UI still styles with system UI.
    fonts: false,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
})
