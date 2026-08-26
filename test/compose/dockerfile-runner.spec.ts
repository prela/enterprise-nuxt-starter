import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dockerfile = readFileSync(
  fileURLToPath(new URL('../../Dockerfile', import.meta.url)),
  'utf8',
)

describe('playground image runner', () => {
  it('copies Nitro output instead of reinstalling its generated package.json with npm', () => {
    // Nitro traces runtime deps into `.output/server/node_modules` during `pnpm build`.
    // Its generated package.json also lists test toolchain (vitest, eslint, …).
    // `npm install` of that manifest on node:22-alpine (npm 10.9.8) crashes:
    // "Cannot read properties of null (reading 'edgesOut')" — Coolify develop deploy.
    expect(dockerfile).toMatch(/COPY --from=build \/app\/\.output \.output/)
    expect(dockerfile).not.toMatch(/^[\t ]*RUN .+\bnpm install\b/m)
  })
})
