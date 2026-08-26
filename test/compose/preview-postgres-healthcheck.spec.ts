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

describe('coolify preview postgres', () => {
  it('still supplies POSTGRES_PASSWORD after Coolify empties same-name ${VAR} mappings', () => {
    const after = emptyCoolifySameNameMappings(compose)
    expect(after).not.toMatch(/^\s+POSTGRES_PASSWORD:\s*\$\{POSTGRES_PASSWORD\}\s*$/m)
    expect(after).toMatch(/env_file:/)
    expect(after).not.toMatch(/^\s+POSTGRES_PASSWORD:\s*$/m)
  })

  it('uses a pg_isready healthcheck with no $ for Coolify to interpolate', () => {
    // `$$POSTGRES_USER` becomes `$playground` after Coolify substitutes
    // `$POSTGRES_USER`, then Compose interpolates that as empty → `-U` with
    // no user → healthcheck never succeeds → `depends_on: service_healthy` fails.
    const command
      = compose.match(/test:\s*\['CMD-SHELL',\s*'([^']+)'\]/)?.[1] ?? ''
    expect(command).toBe('pg_isready')
    expect(compose).toMatch(/start_period:/)
    expect(compose).toMatch(/^\s+PGUSER:\s*\$\{POSTGRES_USER\}\s*$/m)
  })
})
