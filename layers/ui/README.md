# UI Nuxt Layer — Public Layer interface

Products and the Playground Host may depend on `@starter/ui` only through this interface.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/ui'],
})
```

Do not import files under `layers/ui/` (Tiers). Those paths are not public.

## Layouts

The Layer registers Nuxt layouts. Pages pick them with `definePageMeta({ layout: '…' })`. Identity presentation must not own chrome.

| Name | Use |
| --- | --- |
| `default` | Host pages (header, skip link, color mode, main). |
| `auth` | Register and login (centered region, skip link, color mode). |
| `error` | Used by the Layer `error.vue` for unknown routes and render failures. |

## Chrome title

Header brand text comes from `app.config`. The Layer default is `Home`. The Playground Host overrides it; a Product sets its own name.

```ts
export default defineAppConfig({
  starter: {
    chromeTitle: 'Playground',
  },
})
```

## Chrome

Extending this Layer enables Nuxt UI, Tailwind, and color mode. Hosts wrap pages in `NuxtLayout`; they do not deep-import layout files. `UApp` lives in the layouts so Toast and overlays work without a Host `UApp` copy.

shadcn-vue is not part of this interface. Add it only when Nuxt UI has no matching control.
