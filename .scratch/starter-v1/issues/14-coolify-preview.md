# 14: Coolify preview from develop

**What to build:** The owner can open a Coolify preview of the Playground deployed from `develop`, with smoke checks on health, headers, and CSP report-only.

**Blocked by:** 06 Compose — Playground + PostgreSQL; 12 CI on PRs to develop

**Status:** resolved

- [x] Merges to `develop` (or the agreed preview pipeline) deploy a Playground preview on Coolify
- [x] Preview smoke checks health, readiness, security headers, and CSP report-only
- [x] Preview uses PostgreSQL; secrets are not in git
- [x] Owner can complete register/login on the preview (Identity slice is already in `develop` via 12’s blockers)

## Comments

- Seam is Host HTTP only (already agreed in the spec). Smoke does not call Coolify APIs.
- `compose.preview.yaml` is the Coolify topology: Playground + PostgreSQL, no host-published ports (Postgres stays off the public NIC; Coolify proxy talks to `playground:3000`). Live secrets stay in the Coolify UI; `.env.example` documents names only.
- Coolify auto-deploys `develop` (owner enables Auto Deploy). `.github/workflows/preview-smoke.yml` runs `pnpm smoke` on push to `develop` against GitHub variable `PREVIEW_URL`, waiting up to 10 minutes for `/ready`.
- `NUXT_PUBLIC_SITE_URL` on the preview must be the HTTPS origin the owner opens, or Identity cookies will not stick across register/login.

## Answer

Preview is Compose-on-Coolify from `develop` (`compose.preview.yaml`), with Host HTTP smoke (`pnpm smoke`) after each merge. The owner creates the Coolify application, sets env (including `NUXT_PUBLIC_SITE_URL` to the preview origin), enables Auto Deploy, and sets GitHub Actions variable `PREVIEW_URL`. Register/login is the existing Identity slice once that origin matches.
