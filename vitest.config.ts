import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Host HTTP setup builds Nitro; keep the process on one file so ports do not collide.
    fileParallelism: false,
    include: ['test/**/*.spec.ts'],
    testTimeout: 120_000,
    hookTimeout: 180_000,
    env: {
      // Happy-path Host boot. The invalid-env case overrides this per startServer().
      NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
      // Closed port: default Host HTTP tests observe "PostgreSQL is down" without Docker.
      NUXT_DATABASE_URL: 'postgresql://playground:playground@127.0.0.1:59999/playground',
      NUXT_BETTER_AUTH_SECRET: 'test-better-auth-secret-not-for-production',
    },
  },
})
