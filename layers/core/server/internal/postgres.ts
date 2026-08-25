import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Short timeouts so /ready cannot hang a probe while Postgres is unreachable.
const connectTimeoutSeconds = 2

export async function postgresIsReady(databaseUrl: string): Promise<boolean> {
  const client = postgres(databaseUrl, {
    max: 1,
    connect_timeout: connectTimeoutSeconds,
    idle_timeout: 1,
  })

  try {
    // Drizzle is the Starter engine (ADR-0003). Identity later attaches schema to the same URL.
    const db = drizzle(client)
    await db.execute(sql`select 1`)
    return true
  }
  catch {
    return false
  }
  finally {
    await client.end({ timeout: connectTimeoutSeconds })
  }
}
