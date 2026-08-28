import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const productionWorkflow = readFileSync(
  fileURLToPath(new URL('../../.github/workflows/production.yml', import.meta.url)),
  'utf8',
)

describe('production Coolify webhook curl', () => {
  it('does not combine --fail-with-body with -f', () => {
    // GitHub runners ship curl that rejects both flags. -fsS made Production
    // fail before the webhook ran; --fail-with-body already fails on HTTP errors.
    const curlLine = productionWorkflow.split('\n').find(line => /^\s*curl\s/.test(line))
    expect(curlLine).toContain('--fail-with-body')
    expect(curlLine).not.toContain('-fsS')
    expect(curlLine).toContain('curl --fail-with-body -sS')
  })

  it('sends a Coolify API bearer token, not only the deploy URL', () => {
    // Coolify Cloud returns 401 Unauthenticated for GET /api/v1/deploy without Sanctum.
    expect(productionWorkflow).toContain('COOLIFY_API_TOKEN')
    expect(productionWorkflow).toContain('Authorization: Bearer')
  })
})
