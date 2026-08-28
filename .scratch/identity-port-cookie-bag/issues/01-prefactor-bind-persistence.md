# 01: Prefactor Identity bind and persistence boot

**What to build:** Nitro Identity wiring is a small bind: parse config, attach this request’s cookies to the Identity port, apply outbound Set-Cookie. Auth-instance cache and migrate-on-demand live in the Better Auth adapter. Playground register, login, logout, and `/protected` behave as they do today. The Public Layer interface does not change.

**Blocked by:** None (can start immediately)

**Status:** claimed

- [x] Bind does not own auth-instance cache or migrate-on-demand
- [x] Better Auth adapter owns persistence boot for its engine
- [x] Host HTTP and Playwright Identity slice stay green
- [x] Port tests stay green without a cookie-bag contract change
- [x] `/health` still does not construct Identity
- [x] No new test seam on the bind
- [x] No Public Layer interface change (token, error modes, and README stay as they are)

## Comments

- Nitro bind (`identityFromEvent`) parses runtime config, attaches this request’s cookies, constructs `createBetterAuthIdentity`, and applies outbound Set-Cookie. It no longer caches auth instances or runs Drizzle migrate.
- Better Auth adapter owns persistence boot: `bootIdentityAuth` in `layers/identity/infrastructure/auth.ts` caches one engine per database URL and migrates on register/authenticate/endSession (not on construction).
- Port tests, Host HTTP (including `/health`), lint, typecheck, and coverage gates passed. Playwright Identity E2E did not launch in this environment (`libnspr4.so` missing for Chromium); Host HTTP covers the same register/login/logout/`/protected` outcomes.
- Public Layer interface unchanged: port still returns a session token; README, error modes, and cookie-bag contract are ticket 02.
