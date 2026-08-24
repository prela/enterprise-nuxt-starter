import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    '.nuxt/**',
    '.output/**',
    'coverage/**',
    'dist/**',
    'playwright-report/**',
    'test-results/**',
    'pnpm-workspace.yaml',
    'pnpm-lock.yaml',
  ],
})
