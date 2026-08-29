import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export interface LockstepResult {
  ok: boolean
  failures: string[]
}

export interface LockstepInput {
  versions: Record<string, string>
  tag?: string
}

// Work package IDs are two-part (`0.1`, `6.2`). A release tag is three-part `v0.y.z`.
const WORK_PACKAGE_TAG = /^v?\d+\.\d+$/
const ZERO_MAJOR_SEMVER = /^0\.\d+\.\d+$/

/**
 * Lockstep 0.y.z for every Nuxt Layer. Tags must be `v` plus that version.
 * Work package IDs are not releases (ADR-0005).
 */
export function checkLockstepSemver(input: LockstepInput): LockstepResult {
  const failures: string[] = []
  const versionValues = Object.values(input.versions)
  const unique = new Set(versionValues)
  if (unique.size !== 1)
    failures.push('Nuxt Layer versions must be identical (lockstep SemVer)')

  const version = versionValues[0] ?? ''
  if (!ZERO_MAJOR_SEMVER.test(version))
    failures.push('Starter version must stay 0.y.z until a production Product depends on it')

  if (input.tag !== undefined) {
    if (WORK_PACKAGE_TAG.test(input.tag)) {
      failures.push('Work package IDs are not SemVer tags')
    }
    else if (ZERO_MAJOR_SEMVER.test(version) && input.tag !== `v${version}`) {
      failures.push(`Tag must be v${version} (lockstep 0.y.z), got ${input.tag}`)
    }
  }

  return { ok: failures.length === 0, failures }
}

export function layerVersionsFromRepo(rootDir: string): Record<string, string> {
  const versions: Record<string, string> = {}
  for (const name of ['core', 'ui', 'identity', 'i18n']) {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'layers', name, 'package.json'), 'utf8')) as {
      name: string
      version: string
    }
    versions[pkg.name] = pkg.version
  }
  return versions
}

function argValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag)
  if (index === -1)
    return undefined
  return argv[index + 1]
}

export function runLockstepCli(argv: string[], rootDir: string): number {
  const tag = argValue(argv, '--tag')
  const versions = layerVersionsFromRepo(rootDir)
  const result = checkLockstepSemver({
    versions,
    tag,
  })
  if (!result.ok) {
    for (const failure of result.failures)
      console.error(`lockstep: ${failure}`)
    return 1
  }
  const version = Object.values(versions)[0]
  console.log(`lockstep: ok ${version}${tag ? ` tag ${tag}` : ''}`)
  return 0
}

const invoked = process.argv[1] ? resolve(process.argv[1]) : ''
if (invoked === fileURLToPath(import.meta.url)) {
  process.exitCode = runLockstepCli(process.argv.slice(2), process.cwd())
}
