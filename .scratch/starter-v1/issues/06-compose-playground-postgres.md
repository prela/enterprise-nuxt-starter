# 06: Compose — Playground + PostgreSQL

**What to build:** One Compose command boots the Playground and PostgreSQL together. Readiness fails if the database is down, so local and E2E share the same topology.

**Blocked by:** 04 Core Host — health, env, headers

**Status:** resolved

- [x] Compose starts Playground and PostgreSQL with documented env
- [x] Readiness succeeds when Postgres is up and fails when it is down (Host HTTP seam)
- [x] Persistence engine is PostgreSQL via Drizzle when Identity later attaches; MySQL is not introduced
- [x] Secrets and database URL are not committed

## Comments

- `docker compose up --build` starts Playground + PostgreSQL. Copy `.env.example` to `.env` first; `.env` stays gitignored.
- `GET /ready` is `200` when PostgreSQL answers a Drizzle `select 1`, `503` when it does not, always `Cache-Control: no-store`. Boot rejects a missing or non-PostgreSQL `NUXT_DATABASE_URL` (MySQL URLs fail closed).
- Compose interpolates `NUXT_DATABASE_URL` / `DATABASE_URL` from `POSTGRES_*` onto the `postgres` hostname. No MySQL image or driver.

## Answer

Compose (`compose.yaml` + `Dockerfile`) boots the Playground Host and PostgreSQL together. Core readiness pings PostgreSQL via Drizzle; Identity later attaches schema to the same engine. Host HTTP tests cover `/ready` 503 when Postgres is down, 200 when a PostgreSQL-wire listener is up, and boot failure for missing or MySQL URLs. Live secrets stay in gitignored `.env`.
