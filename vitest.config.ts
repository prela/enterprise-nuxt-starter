import { defineConfig } from 'vitest/config'

// 95% gate for domain and application-service modules (spec story 63).
const domainAndApplicationThresholds = {
  statements: 95,
  branches: 95,
  functions: 95,
  lines: 95,
}

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
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      // Starter TypeScript. Vue SFCs are omitted: v8 cannot parse them, and the
      // spec says not to chase Vue glue to 95%. Host HTTP/Playwright cover that seam.
      include: [
        'layers/**/*.ts',
        'app/**/*.ts',
      ],
      exclude: [
        // Generated types and Layer wiring: out of the 95% gate, and not in the
        // 80% denominator (configs are not executed by in-process port tests).
        // content.config.ts is the docs collection contract, not application logic.
        '**/*.d.ts',
        '**/nuxt.config.ts',
        '**/content.config.ts',
        '**/drizzle.config.ts',
        // Nitro child + adapters: Host HTTP tests them at the HTTP seam, not here.
        'layers/**/infrastructure/**',
        'layers/**/server/**',
      ],
      thresholds: {
        // Floor on the measured TypeScript pool (port, domain, application, app config).
        'statements': 80,
        'branches': 80,
        'functions': 80,
        'lines': 80,
        'layers/**/domain/**/*.ts': domainAndApplicationThresholds,
        'layers/**/application/**/*.ts': domainAndApplicationThresholds,
      },
    },
  },
})
