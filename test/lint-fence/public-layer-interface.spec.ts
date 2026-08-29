import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))

describe('public Nuxt Layer interface fence', () => {
  it('fails lint on a deep import of another Nuxt Layer’s Tiers', async () => {
    // Match `pnpm lint`: Antfu otherwise thinks this is an editor and drops rules.
    process.env.CI = 'true'
    const eslint = new ESLint({ cwd: repoRoot })
    const [result] = await eslint.lintText(
      `import { corePublicConfigSchema } from '../../layers/core/server/internal/runtime-config'\n`,
      { filePath: `${repoRoot}/app/forbidden-core-tier-import.ts` },
    )

    expect(result.errorCount).toBeGreaterThan(0)
    expect(result.messages.some(message => /Tier|deep import|Public Layer/i.test(message.message))).toBe(true)
  })

  it('fails lint on a deep import of UI Layer Tiers', async () => {
    process.env.CI = 'true'
    const eslint = new ESLint({ cwd: repoRoot })
    const [result] = await eslint.lintText(
      `import DefaultLayout from '../../layers/ui/app/layouts/default.vue'\n`,
      { filePath: `${repoRoot}/app/forbidden-ui-tier-import.ts` },
    )

    expect(result.errorCount).toBeGreaterThan(0)
    expect(result.messages.some(message => /Tier|deep import|Public Layer/i.test(message.message))).toBe(true)
  })

  it('fails lint on a deep import of Identity Layer Tiers', async () => {
    process.env.CI = 'true'
    const eslint = new ESLint({ cwd: repoRoot })
    const [result] = await eslint.lintText(
      `import { createIdentity } from '../../layers/identity/application/create-identity'\n`,
      { filePath: `${repoRoot}/app/forbidden-identity-tier-import.ts` },
    )

    expect(result.errorCount).toBeGreaterThan(0)
    expect(result.messages.some(message => /Tier|deep import|Public Layer/i.test(message.message))).toBe(true)
  })

  it('fails lint on a deep import of Content Layer Tiers', async () => {
    process.env.CI = 'true'
    const eslint = new ESLint({ cwd: repoRoot })
    const [result] = await eslint.lintText(
      `import docsConfig from '../../layers/content/content.config'\n`,
      { filePath: `${repoRoot}/app/forbidden-content-tier-import.ts` },
    )

    expect(result.errorCount).toBeGreaterThan(0)
    expect(result.messages.some(message => /Tier|deep import|Public Layer/i.test(message.message))).toBe(true)
  })

  it('fails lint on a deep import of SEO Layer Tiers', async () => {
    process.env.CI = 'true'
    const eslint = new ESLint({ cwd: repoRoot })
    const [result] = await eslint.lintText(
      `import siteUrlFromCore from '../../layers/seo/server/plugins/site-url-from-core'\n`,
      { filePath: `${repoRoot}/app/forbidden-seo-tier-import.ts` },
    )

    expect(result.errorCount).toBeGreaterThan(0)
    expect(result.messages.some(message => /Tier|deep import|Public Layer/i.test(message.message))).toBe(true)
  })
})
