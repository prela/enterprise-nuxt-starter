import { createTest } from '@nuxt/test-utils/e2e'
import { expect, test as nuxtTest } from '@nuxt/test-utils/playwright'

export { expect }

// @nuxt/test-utils hardcodes the Playwright `_nuxtHooks` fixture at 60s on Linux.
// `playwright.config.ts` `nuxt.setupTimeout` is ignored by that fixture. Catalogue
// Host production builds (i18n + content + SEO prerender) exceed 60s on GitHub runners.
const NUXT_HOOKS_TIMEOUT_MS = 180_000

export const test = nuxtTest.extend({
  _nuxtHooks: [async ({ nuxt, defaults }, use) => {
    const hooks = createTest({
      ...defaults.nuxt,
      ...nuxt,
    })
    await hooks.beforeAll()
    await use(hooks)
    await hooks.afterAll()
  }, {
    scope: 'worker',
    timeout: NUXT_HOOKS_TIMEOUT_MS,
  }],
})
