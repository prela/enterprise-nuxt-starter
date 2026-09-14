# 01: Deployed-origin catalogue smoke (7.6)

**Parent:** `.scratch/lockstep-0.1.0/spec.md`

**What to build:** Preview and production smoke fail closed on Catalogue Layer Host HTTP. A Coolify origin cannot go green on `/ready` while `/docs` is 404, `/hr` does not redirect, the sitemap hides docs or advertises Identity, `/login` is not English and unprefixed, or anonymous `/protected` does not send a visitor to `/login`. Health, readiness, headers, and CSP report-only stay. No Playwright against Coolify. No Principal.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `/docs` 200 with “Playground proof” on the shared smoke contract
- [x] `/hr` redirects to `/hr/docs`
- [x] Sitemap (following index redirects) lists home and docs; excludes `/login`, `/register`, `/protected`
- [x] `/login` is English and unprefixed
- [x] Anonymous `/protected` redirects to `/login`
- [x] Existing health, readiness, baseline headers, and CSP report-only still pass
- [x] Preview and production share this contract
- [x] TDD: failing fixture-Host tests before the checker is wired
- [x] No Coolify Playwright; no register or Session cookie in smoke

## Answer

Preview and production `pnpm smoke` share one Host HTTP contract. Fixture-Host tests fail closed when `/docs` is missing “Playground proof”, `/hr` does not redirect to `/hr/docs`, the sitemap (following a 307 index) hides home/docs or advertises Identity, `/login` is prefixed or not English, or anonymous `/protected` does not redirect to `/login`. Health, readiness, headers, and CSP report-only still run first. No Playwright, register, or Session cookie.

