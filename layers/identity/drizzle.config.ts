import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

// Identity-owned migrations. Run from this package so Core never owns user/session tables.
export default defineConfig({
  schema: './infrastructure/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? process.env.NUXT_DATABASE_URL ?? '',
  },
})
