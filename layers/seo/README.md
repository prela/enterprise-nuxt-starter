# SEO Nuxt Layer — Public Layer interface

Products may depend on `@starter/seo` only through this interface. A Product may omit this Layer entirely.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/seo'],
})
```

Do not import files under `layers/seo/` (Tiers). Those paths are not public. There is no wrapper composable.

This Layer does not `extends` i18n, content, Identity, or UI. The Host composes catalogue Layers. Site origin is Core’s existing public site URL; do not set a second origin env (`NUXT_SITE_URL`).

## Defaults

Extending this Layer registers Nuxt SEO with robots, sitemap, and Open Graph defaults.

| Capability | Default | Host may |
| --- | --- | --- |
| Origin | Core `NUXT_PUBLIC_SITE_URL` (`runtimeConfig.public.siteUrl`) | Keep using Core’s env |
| Robots | Indexable (allow all) | `noindex` selected routes |
| Sitemap | Discovered routes at `/sitemap.xml` | Exclude paths |
| Open Graph | `og:*` / canonical defaults from Nuxt SEO | Set page title, description, and images |

## Origin

Core already validates `NUXT_PUBLIC_SITE_URL`. This Layer copies that public origin into Nuxt SEO site config at runtime. Do not add `NUXT_SITE_URL`.

## Host `noindex`

A Host that takes Identity (or any private route) can `noindex` those paths without forking this Layer:

```ts
export default defineNuxtConfig({
  extends: ['@starter/core', '@starter/seo'],
  routeRules: {
    '/login': { robots: false },
    '/register': { robots: false },
    '/protected': { robots: false },
  },
})
```

`robots: false` sends `noindex` and keeps the path off `robots.txt` / the sitemap. Identity route exclusions are Host composition, not this Layer’s defaults.
