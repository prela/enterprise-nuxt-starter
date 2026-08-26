# Enterprise Nuxt Starter

Playground Host at the repository root. It `extends` the Core, UI, and Identity Nuxt Layers.

## Local topology (Compose)

One command boots the Playground and PostgreSQL together. Copy `.env.example` to `.env` first — `.env` is gitignored and must not be committed.

```bash
cp .env.example .env
docker compose up --build
```

- `GET /health` — process is up (`Cache-Control: no-store`)
- `GET /ready` — `200` when PostgreSQL is up, `503` when it is down (`Cache-Control: no-store`)
- `GET /register` — SSR register form (Identity Layer)

Persistence is PostgreSQL via Drizzle (ADR-0003). Identity owns user and session migrations on this engine. MySQL is not used.

To run the Host with `pnpm dev` against the same Postgres:

```bash
docker compose up postgres
pnpm install
pnpm dev
```

`pnpm dev` uses `NUXT_DATABASE_URL` from `.env` (localhost). The Playground Compose service uses the `postgres` hostname on the Compose network. `.env` also documents `DATABASE_URL` as the same URL for Drizzle when Identity attaches.

## Coolify preview (`develop`)

Merges to `develop` deploy the Playground on Coolify from `compose.preview.yaml` (Playground + PostgreSQL, no host-published ports). Secrets stay in Coolify; they are not in git.

1. In Coolify, create an application from this GitHub repository, branch `develop`, build pack **Docker Compose**, compose file `compose.preview.yaml`.
2. Set the playground domain on port `3000` (HTTPS).
3. In Coolify environment variables, set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `NUXT_BETTER_AUTH_SECRET` (32+ characters), and `NUXT_PUBLIC_SITE_URL` to that HTTPS origin. Do not commit those values.
4. Advanced → enable **Auto Deploy** so pushes to `develop` rebuild the preview ([Coolify auto-deploy](https://coolify.io/docs/applications/ci-cd/github/auto-deploy)).
5. Deploy once, open the preview, and complete register/login (Identity cookies require `NUXT_PUBLIC_SITE_URL` to match the origin you open).
6. In GitHub → Settings → Secrets and variables → Actions → Variables, set `PREVIEW_URL` to that origin (no trailing slash). Pushes to `develop` then run `pnpm smoke` against it.

```bash
pnpm smoke --url https://preview.example.com
```

## Scripts

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm smoke
pnpm build
```
