// Copy Core’s public origin into Nuxt SEO site config so Hosts never set NUXT_SITE_URL.
// Core already validates NUXT_PUBLIC_SITE_URL onto runtimeConfig.public.siteUrl; this Layer does not extend Core,
// but a Host that extends both merges that key. Empty values are left unset so a misconfigured Host still fails Core’s boot check.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('site-config:init', ({ event, siteConfig }) => {
    const siteUrl = useRuntimeConfig(event).public.siteUrl
    if (typeof siteUrl === 'string' && siteUrl.length > 0) {
      siteConfig.push({ url: siteUrl })
    }
  })
})
