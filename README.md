# Enterprise Nuxt Starter

Playground Host at the repository root. It `extends` the Core and UI Nuxt Layers. Identity lands in a later work package.

## Local topology (Compose)

One command boots the Playground and PostgreSQL together. Copy `.env.example` to `.env` first — `.env` is gitignored and must not be committed.

```bash
cp .env.example .env
docker compose up --build
```

- `GET /health` — process is up (`Cache-Control: no-store`)
- `GET /ready` — `200` when PostgreSQL is up, `503` when it is down (`Cache-Control: no-store`)

Persistence is PostgreSQL via Drizzle (ADR-0003). Identity later attaches schema to this engine. MySQL is not used.

To run the Host with `pnpm dev` against the same Postgres:

```bash
docker compose up postgres
pnpm install
pnpm dev
```

`pnpm dev` uses `NUXT_DATABASE_URL` from `.env` (localhost). The Playground Compose service uses the `postgres` hostname on the Compose network. `.env` also documents `DATABASE_URL` as the same URL for Drizzle when Identity attaches.

## Scripts

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
