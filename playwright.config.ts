import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import { playgroundEnv } from './test/host-ui/global-setup'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig<ConfigOptions>({
  testDir: './test/host-ui',
  testMatch: '*.e2e.ts',
  // One Host process and one PGlite listener: do not shard this suite.
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  globalSetup: './test/host-ui/global-setup.ts',
  use: {
    nuxt: {
      rootDir,
      browser: true,
      server: true,
      env: playgroundEnv,
      // Mirrored on the `_nuxtHooks` fixture in test/host-ui/nuxt-test.ts — this
      // option does not raise @nuxt/test-utils’ hardcoded 60s Playwright timeout.
      setupTimeout: 180_000,
    },
    ...devices['Desktop Chrome'],
  },
})
