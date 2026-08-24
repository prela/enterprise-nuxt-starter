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
    // Anyone outside Core (Host, later Nuxt Layers) may extend Core; they may not import its Tiers.
    files: ['**/*.{js,ts,vue}'],
    ignores: ['layers/core/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/layers/core/**',
              '@starter/core/*',
              '@starter/core/**',
            ],
            message: 'Deep imports of another Nuxt Layer’s Tiers are forbidden. Use the Public Layer interface.',
          },
        ],
      }],
    },
  },
)
