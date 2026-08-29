# i18n Nuxt Layer — Public Layer interface

Products may depend on `@starter/i18n` only through this interface. A Product may omit this Layer entirely. Identity does not depend on this Layer.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/i18n'],
})
```

Do not import files under `layers/i18n/` (Tiers). Those paths are not public. Do not deep-import `vue-i18n`. There is no wrapper composable.

This Layer does not `extends` content, seo, Identity, or UI. The Host composes catalogue Layers.

## Defaults

| Option | Value | Meaning |
| --- | --- | --- |
| default locale | `en` | English. Unprefixed URLs are this locale. |
| strategy | `prefix_except_default` | Other locales take a prefix (`/hr/...`). English stays unprefixed. |
| `detectBrowserLanguage` | `false` | Unprefixed English URLs stay stable. Hosts may enable detection when they add locales. |

The Layer registers English only. Hosts add further locales rather than this Layer hard-coding market languages.

```ts
export default defineNuxtConfig({
  extends: ['@starter/i18n'],
  i18n: {
    locales: [
      { code: 'hr', language: 'hr', name: 'Hrvatski' },
    ],
  },
})
```

Nuxt i18n merges Host locales with the Layer’s English locale.
