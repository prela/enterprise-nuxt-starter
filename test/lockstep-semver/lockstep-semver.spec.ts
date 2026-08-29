import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { checkLockstepSemver } from '../../scripts/lockstep-semver'

const layerManifests = ['core', 'ui', 'identity', 'i18n'].map((name) => {
  const path = fileURLToPath(new URL(`../../layers/${name}/package.json`, import.meta.url))
  return JSON.parse(readFileSync(path, 'utf8')) as { name: string, version: string }
})

describe('lockstep 0.y.z SemVer', () => {
  it('fails when Nuxt Layer versions are not identical', () => {
    const result = checkLockstepSemver({
      versions: {
        '@starter/core': '0.1.0',
        '@starter/ui': '0.2.0',
        '@starter/identity': '0.1.0',
      },
    })

    expect(result.ok).toBe(false)
    expect(result.failures.join('\n')).toMatch(/lockstep|identical|same version/i)
  })

  it('rejects 1.0.0 until a production Product depends on the Starter', () => {
    const versions = {
      '@starter/core': '1.0.0',
      '@starter/ui': '1.0.0',
      '@starter/identity': '1.0.0',
    }

    const result = checkLockstepSemver({ versions, tag: 'v1.0.0' })

    expect(result.ok).toBe(false)
    expect(result.failures.join('\n')).toMatch(/0\.y\.z/i)
  })

  it('rejects work package IDs as release tags', () => {
    const versions = {
      '@starter/core': '0.1.0',
      '@starter/ui': '0.1.0',
      '@starter/identity': '0.1.0',
    }

    for (const tag of ['0.1', '1.1', '3.3', '6.2', 'v0.1', 'v6.2']) {
      const result = checkLockstepSemver({ versions, tag })
      expect(result.ok, tag).toBe(false)
      expect(result.failures.join('\n'), tag).toMatch(/work package/i)
    }
  })

  it('accepts a v0.y.z tag that matches the lockstep Layer version', () => {
    const result = checkLockstepSemver({
      versions: {
        '@starter/core': '0.1.0',
        '@starter/ui': '0.1.0',
        '@starter/identity': '0.1.0',
      },
      tag: 'v0.1.0',
    })

    expect(result.failures).toEqual([])
    expect(result.ok).toBe(true)
  })

  it('keeps every Nuxt Layer on the same 0.y.z version', () => {
    const versions = Object.fromEntries(layerManifests.map(pkg => [pkg.name, pkg.version]))
    const result = checkLockstepSemver({ versions })

    expect(result.failures).toEqual([])
    expect(result.ok).toBe(true)
    expect(layerManifests.map(pkg => pkg.version)).toEqual([
      layerManifests[0]?.version,
      layerManifests[0]?.version,
      layerManifests[0]?.version,
      layerManifests[0]?.version,
    ])
  })
})
