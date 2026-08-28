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

After that PR is merged, run the owner wizard (opens Coolify and GitHub, captures values, sets `PREVIEW_URL`):

```bash
./scripts/setup-coolify-preview.sh
```

1. In Coolify, create an application from this GitHub repository, branch `develop`, build pack **Docker Compose**, compose file `compose.preview.yaml`.
2. Set the playground domain on port `3000` (HTTPS).
3. In Coolify environment variables, set `NUXT_BETTER_AUTH_SECRET` (32+ characters) and `NUXT_PUBLIC_SITE_URL` to that HTTPS origin. Postgres user/password come from Coolify magic vars in `compose.preview.yaml` (`SERVICE_USER_POSTGRES` / `SERVICE_PASSWORD_POSTGRES`). Do not commit secret values.
4. Advanced → enable **Auto Deploy** so pushes to `develop` rebuild the preview ([Coolify auto-deploy](https://coolify.io/docs/applications/ci-cd/github/auto-deploy)).
5. Deploy once, open the preview, and complete register/login (Identity cookies require `NUXT_PUBLIC_SITE_URL` to match the origin you open).
6. In GitHub → Settings → Secrets and variables → Actions → Variables, set `PREVIEW_URL` to that origin (no trailing slash). Pushes to `develop` then run `pnpm smoke` against it.

```bash
pnpm smoke --url https://preview.example.com
```

## Coolify production (SemVer tag on `main`)

Production is an intentional release: a PR `develop` → `main`, then a `v0.y.z` tag. Merges to `main` do not deploy. All three Nuxt Layers stay on one lockstep `0.y.z` version (not `1.0.0` until a production Product depends on the Starter). Work package IDs (`0.1`, `6.2`) are not tags. Conventional Commits (`feat:`, `fix:`, `BREAKING CHANGE:`) are the changelog.

After preview is live, run:

```bash
./scripts/setup-coolify-production.sh
```

1. Create a **second** Coolify application from this repository, branch `main`, compose file `compose.preview.yaml` (same topology, separate Postgres volume).
2. Set the production domain on port `3000`. Set `NUXT_BETTER_AUTH_SECRET` and `NUXT_PUBLIC_SITE_URL` to the production origin. Auto Deploy stays **off**.
3. Put the Coolify deploy webhook in GitHub secret `COOLIFY_PRODUCTION_WEBHOOK`. Set Actions variable `PRODUCTION_URL` to the production origin.
4. Open a release PR `develop` → `main` (not a direct push). When `ci` is green, merge.
5. Tag the merge commit `v0.y.z` matching `layers/*/package.json`, then `git push origin v0.y.z`. GitHub Actions deploys Coolify and runs `pnpm smoke` against `PRODUCTION_URL`.

```bash
pnpm lockstep --tag v0.0.0
pnpm smoke --url https://playground.example.com
```

## Scripts

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm lockstep
pnpm smoke
pnpm build
```
