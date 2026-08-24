import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    '.nuxt/**',
    '.output/**',
    'dist/**',
    'pnpm-workspace.yaml',
    'pnpm-lock.yaml',
  ],
})
