import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const example = readFileSync(
  fileURLToPath(new URL('../.env.example', import.meta.url)),
  'utf8',
)

function envValue(file: string, key: string): string | undefined {
  for (const line of file.split('\n')) {
    if (line.startsWith('#') || !line.includes('='))
      continue
    const eq = line.indexOf('=')
    const k = line.slice(0, eq)
    if (k === key)
      return line.slice(eq + 1)
  }
}

describe('.env.example', () => {
  // `cp .env.example .env` is the local boot path. A placeholder shorter than 32
  // characters would fail Identity's Nitro plugin with the same Zod too_small
  // error operators see on localhost:3000.
  it('documents a NUXT_BETTER_AUTH_SECRET that satisfies Identity boot', () => {
    const secret = envValue(example, 'NUXT_BETTER_AUTH_SECRET')
    expect(secret).toBeDefined()
    expect(secret!.length).toBeGreaterThanOrEqual(32)
  })
})
