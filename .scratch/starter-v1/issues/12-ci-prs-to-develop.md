# 12: CI on PRs to develop

**What to build:** Every PR into `develop` runs lint, typecheck, Identity-port tests, and Playwright. A red slice cannot merge.

**Blocked by:** 02 GitHub remote; 11 Log out

**Status:** claimed

- [x] GitHub Actions on PRs to `develop` run lint, typecheck, unit tests at the Identity port, and Playwright at the Host HTTP/UI seam
- [x] A failing job blocks merge
- [x] CI uses repo scripts only (no global installs on the runner beyond what the workflow installs from the lockfile)
- [x] Playwright covers register → login → protected page → logout (11 implies 08–10 are present)

## Comments

- Workflow is `.github/workflows/ci.yml`, job name `ci`, on `pull_request` to `develop`. Steps are `pnpm lint`, `pnpm typecheck`, `pnpm test` (Identity port + Host HTTP + lint fence), then `pnpm test:e2e`.
- `pnpm test:e2e` is Playwright at the Host HTTP/UI seam: register → login → protected page → logout, including an httpOnly session cookie that is not the CSRF cookie.
- Chromium is installed in CI with `pnpm exec playwright install --with-deps chromium` (lockfile package, not `npm i -g`).
- Branch protection on `develop` requires the `ci` check so a red job cannot merge.

## Answer

PRs into `develop` run lint, typecheck, Vitest (Identity port and Host HTTP), and Playwright E2E of the Identity slice. The `ci` check is required on `develop`, so a failing job blocks merge.
