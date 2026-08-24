import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('root toolchain scripts', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
    scripts?: Record<string, string>
  }

  it('exposes lint, typecheck, and test scripts', () => {
    expect(pkg.scripts?.lint).toBeTruthy()
    expect(pkg.scripts?.typecheck).toBeTruthy()
    expect(pkg.scripts?.test).toBeTruthy()
  })
})
