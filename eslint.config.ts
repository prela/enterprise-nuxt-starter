import antfu from '@antfu/eslint-config'

// Pin Vue and TypeScript so Host lint matches the Bible even before Layers exist.
export default antfu(
  {
    vue: true,
    typescript: true,
    ignores: [
      'layers/identity/drizzle/**',
    ],
  },
  {
    // trustPolicy=no-downgrade rejects this lockfile (semver@6.3.1 trust downgrade).
    rules: {
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
  {
    // Host and other Layers may extend packages; they may not import those Layers' Tiers.
    // `@starter/identity/port` is the Identity Public Layer interface and is not listed here.
    files: ['**/*.{js,ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/layers/core/**',
              '@starter/core/*',
              '@starter/core/**',
              '**/layers/ui/**',
              '@starter/ui/*',
              '@starter/ui/**',
              '**/layers/identity/**',
              '@starter/identity/domain',
              '@starter/identity/domain/**',
              '@starter/identity/application',
              '@starter/identity/application/**',
              '@starter/identity/infrastructure',
              '@starter/identity/infrastructure/**',
              '#identity',
              '#identity/**',
              '**/layers/content/**',
              '@starter/content/*',
              '@starter/content/**',
              '**/layers/seo/**',
              '@starter/seo/*',
              '@starter/seo/**',
              '#layers/core/**',
              '#layers/ui/**',
              '#layers/identity/**',
              '#layers/content/**',
              '#layers/seo/**',
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // Core Tiers may import within Core; they still must not reach into UI, Identity, content, or SEO.
    files: ['layers/core/**/*.{js,ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/layers/ui/**',
              '@starter/ui/*',
              '@starter/ui/**',
              '**/layers/identity/**',
              '@starter/identity/domain',
              '@starter/identity/domain/**',
              '@starter/identity/application',
              '@starter/identity/application/**',
              '@starter/identity/infrastructure',
              '@starter/identity/infrastructure/**',
              '#identity',
              '#identity/**',
              '**/layers/content/**',
              '@starter/content/*',
              '@starter/content/**',
              '**/layers/seo/**',
              '@starter/seo/*',
              '@starter/seo/**',
              '#layers/core/**',
              '#layers/ui/**',
              '#layers/identity/**',
              '#layers/content/**',
              '#layers/seo/**',
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // UI Tiers may import within UI; they still must not reach into Core, Identity, content, or SEO.
    files: ['layers/ui/**/*.{js,ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/layers/core/**',
              '@starter/core/*',
              '@starter/core/**',
              '**/layers/identity/**',
              '@starter/identity/domain',
              '@starter/identity/domain/**',
              '@starter/identity/application',
              '@starter/identity/application/**',
              '@starter/identity/infrastructure',
              '@starter/identity/infrastructure/**',
              '#identity',
              '#identity/**',
              '**/layers/content/**',
              '@starter/content/*',
              '@starter/content/**',
              '**/layers/seo/**',
              '@starter/seo/*',
              '@starter/seo/**',
              '#layers/core/**',
              '#layers/ui/**',
              '#layers/identity/**',
              '#layers/content/**',
              '#layers/seo/**',
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // Identity Tiers may import within Identity; they still must not reach into Core, UI, content, or SEO.
    files: ['layers/identity/**/*.{js,ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/layers/core/**',
              '@starter/core/*',
              '@starter/core/**',
              '**/layers/ui/**',
              '@starter/ui/*',
              '@starter/ui/**',
              '**/layers/content/**',
              '@starter/content/*',
              '@starter/content/**',
              '**/layers/seo/**',
              '@starter/seo/*',
              '@starter/seo/**',
              '#layers/content/**',
              '#layers/seo/**',
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // Content Tiers may import within content; they still must not reach into Core, UI, Identity, or SEO.
    files: ['layers/content/**/*.{js,ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/layers/core/**',
              '@starter/core/*',
              '@starter/core/**',
              '**/layers/ui/**',
              '@starter/ui/*',
              '@starter/ui/**',
              '**/layers/identity/**',
              '@starter/identity/domain',
              '@starter/identity/domain/**',
              '@starter/identity/application',
              '@starter/identity/application/**',
              '@starter/identity/infrastructure',
              '@starter/identity/infrastructure/**',
              '#identity',
              '#identity/**',
              '**/layers/seo/**',
              '@starter/seo/*',
              '@starter/seo/**',
              '#layers/core/**',
              '#layers/ui/**',
              '#layers/identity/**',
              '#layers/seo/**',
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // SEO Tiers may import within SEO; they still must not reach into Core, UI, Identity, or content.
    files: ['layers/seo/**/*.{js,ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/layers/core/**',
              '@starter/core/*',
              '@starter/core/**',
              '**/layers/ui/**',
              '@starter/ui/*',
              '@starter/ui/**',
              '**/layers/identity/**',
              '@starter/identity/domain',
              '@starter/identity/domain/**',
              '@starter/identity/application',
              '@starter/identity/application/**',
              '@starter/identity/infrastructure',
              '@starter/identity/infrastructure/**',
              '#identity',
              '#identity/**',
              '**/layers/content/**',
              '@starter/content/*',
              '@starter/content/**',
              '#layers/core/**',
              '#layers/ui/**',
              '#layers/identity/**',
              '#layers/content/**',
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
)
