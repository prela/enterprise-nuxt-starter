import antfu from '@antfu/eslint-config'

// Pin Vue and TypeScript so Host lint matches the Bible even before Layers exist.
export default antfu(
  {
    vue: true,
    typescript: true,
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
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // Core Tiers may import within Core; they still must not reach into UI or Identity.
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
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // UI Tiers may import within UI; they still must not reach into Core or Identity.
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
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
  {
    // Identity Tiers may import within Identity; they still must not reach into Core or UI.
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
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
)
