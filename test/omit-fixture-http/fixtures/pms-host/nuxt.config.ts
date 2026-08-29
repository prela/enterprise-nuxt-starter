import { createRequire } from 'node:module'
import { dirname } from 'node:path'

const identityRoot = dirname(createRequire(import.meta.url).resolve('@starter/identity'))

// PMS-shaped omit fixture: Core, UI, Identity. No content, seo, or i18n.
// CI-only Host; never deployed (ADR-0007). Not a second Playground.
export default defineNuxtConfig({
  extends: [
    '@starter/core',
    '@starter/ui',
    '@starter/identity',
  ],
  compatibilityDate: '2025-07-15',
  alias: {
    // Identity server files import `#layers/identity/...`. Nuxt names that alias
    // from a Host-adjacent `layers/` directory; this CI Host is not at repo root.
    '#layers/identity': identityRoot,
  },
})
