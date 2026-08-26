import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const compose = readFileSync(
  fileURLToPath(new URL('../../compose.preview.yaml', import.meta.url)),
  'utf8',
)

/**
 * Coolify #9136: same-name mappings (`POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}`)
 * were resolved to empty before Docker Compose ran. Reproduce that strip here
 * so this file stays red on the preview topology that made postgres unhealthy.
 */
function emptyCoolifySameNameMappings(yaml: string): string {
  return yaml.replace(
    /^(\s*)([A-Z][A-Z0-9_]*):\s*\$\{\2\}\s*$/gm,
    '$1$2: ',
  )
}

/** Postgres service only — playground interpolates the same names in DATABASE_URL. */
function postgresService(yaml: string): string {
  const start = yaml.indexOf('\n  postgres:\n')
  const next = yaml.indexOf('\n  playground:\n')
  return start === -1 || next === -1 ? '' : yaml.slice(start, next)
}

describe('coolify preview postgres', () => {
  it('still supplies POSTGRES_PASSWORD after Coolify empties same-name mappings', () => {
    const after = emptyCoolifySameNameMappings(compose)
    expect(after).not.toMatch(/^\s+POSTGRES_PASSWORD:\s*\$\{POSTGRES_PASSWORD\}\s*$/m)
    expect(after).toMatch(/env_file:/)
    expect(after).not.toMatch(/^\s+POSTGRES_PASSWORD:\s*$/m)
  })

  it('lists POSTGRES credentials as name-only env keys so Coolify injects them onto postgres', () => {
    // Coolify 4.3.11 only puts UI secrets on a compose service when they appear
    // under that service's environment: (Show deployable compose had none).
    // env_file: .env does not carry POSTGRES_PASSWORD, so the official image
    // exits: "Database is uninitialized and superuser password is not specified."
    // Name-only list items (same as SERVICE_URL_PLAYGROUND_3000) let Coolify
    // inject. KEY: ${KEY} is #9136 and becomes empty.
    const postgres = postgresService(compose)
    expect(postgres).toMatch(/^\s+- POSTGRES_USER\s*$/m)
    expect(postgres).toMatch(/^\s+- POSTGRES_PASSWORD\s*$/m)
    expect(postgres).toMatch(/^\s+- POSTGRES_DB\s*$/m)
    expect(postgres).not.toMatch(/^\s+POSTGRES_(?:USER|PASSWORD|DB):\s*\$\{/m)
    expect(postgres).not.toMatch(/^\s+- POSTGRES_(?:USER|PASSWORD|DB)=\$\{/m)
  })

  it('does not wait on postgres health so Coolify up -d can finish', () => {
    // Coolify 4.3.11 injects `POSTGRES_USER: null` onto the postgres service
    // when this file interpolates `${POSTGRES_USER}` there (seen in Show
    // deployable compose). That unsets env_file's user, pg_isready never
    // passes, and `service_healthy` fails the deploy. Playground `/ready`
    // is the wait; compose only needs postgres to have started.
    expect(compose).not.toMatch(/condition:\s*service_healthy/)
    expect(compose).not.toMatch(/^\s+PGUSER:/m)
    const lines = compose.split('\n')
    const dependsIndex = lines.findIndex(line => line.trim() === 'depends_on:')
    expect(lines[dependsIndex + 1]?.trim()).toBe('- postgres')
  })
})
