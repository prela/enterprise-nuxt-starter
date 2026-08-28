# 15: Production from SemVer tag on main

**What to build:** A release PR from `develop` into `main`, then a SemVer tag on `main`, deploys the Playground to production on Coolify. Production is an intentional release, not every merge.

**Blocked by:** 14 Coolify preview from develop

**Status:** resolved

- [x] Release path is a PR `develop` → `main` (not a direct push)
- [x] A SemVer tag on `main` deploys production Playground on Coolify
- [x] Production smoke checks health, headers, and CSP report-only
- [x] Version is lockstep `0.y.z` for all Nuxt Layers; this ticket does not bump to `1.0.0` (that waits until a production Product depends on the Starter)
- [x] Work package IDs are not used as SemVer tags
- [x] Conventional Commits remain the changelog input

## Comments

- Seam is Host HTTP only (same contract as preview). Smoke does not call Coolify APIs. `PRODUCTION_URL` is an origin for that seam; `PREVIEW_URL` still works.
- Coolify does not deploy git tags natively. `.github/workflows/production.yml` runs on `v0.*` tags that **are** `origin/main`'s tip, checks lockstep `0.y.z`, hits secret `COOLIFY_PRODUCTION_WEBHOOK`, then `pnpm smoke` against `vars.PRODUCTION_URL`. Auto Deploy on the production app stays off so merges to `main` do not ship.
- Topology stays `compose.preview.yaml` (two Coolify applications, separate volumes). Owner wizard: `./scripts/setup-coolify-production.sh`.
- `scripts/lockstep-semver.ts` rejects mismatched Layer versions, `1.0.0`, and work package IDs (`0.1`, `6.2`, `v0.1`). Tags must be `v` plus the lockstep version. Conventional Commits stay the changelog; no CalVer.

## Answer

Production is a release PR `develop` → `main`, then a `v0.y.z` tag. That tag deploys the Playground on Coolify (deploy webhook) and smokes health, headers, and CSP report-only. Layers stay lockstep `0.0.0`. After merge, run `./scripts/setup-coolify-production.sh`, then open the first `develop` → `main` PR and tag.
