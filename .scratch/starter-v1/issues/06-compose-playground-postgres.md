# 06: Compose — Playground + PostgreSQL

**What to build:** One Compose command boots the Playground and PostgreSQL together. Readiness fails if the database is down, so local and E2E share the same topology.

**Blocked by:** 04 Core Host — health, env, headers

**Status:** ready-for-agent

- [ ] Compose starts Playground and PostgreSQL with documented env
- [ ] Readiness succeeds when Postgres is up and fails when it is down (Host HTTP seam)
- [ ] Persistence engine is PostgreSQL via Drizzle when Identity later attaches; MySQL is not introduced
- [ ] Secrets and database URL are not committed
