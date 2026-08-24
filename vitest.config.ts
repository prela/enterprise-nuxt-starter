import { defineConfig } from 'vitest/config'

// Placeholder only: Identity-port and Host HTTP/UI tests land in later WPs.
// passWithNoTests keeps `pnpm test` green without inventing a third seam.
export default defineConfig({
  test: {
    passWithNoTests: true,
  },
})
