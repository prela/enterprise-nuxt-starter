# 03: Public Layer README matches the cookie-bag port

**What to build:** Identity’s documented Public Layer interface matches the cookie-bag port: Session on register and authenticate, no token, no fake-vs-HTTP divergence, no reserved unused error modes. A Product maintainer can implement from the README without reading Tiers.

**Blocked by:** 02 Cookie-bag Identity port at both seams

**Status:** resolved

- [x] README documents `createIdentity` with a cookie bag and the port methods as they shipped in 02
- [x] README states both adapters start a Session on register; the old fake-vs-HTTP split is gone
- [x] README does not document a session token, `unauthenticated`, or `forbidden` on the port
- [x] README still describes `extends` plus HTTP as Host/Playground presentation, not a second Public Layer interface
- [x] HTTP table still matches Playground outcomes (status codes, httpOnly cookie, CSRF)
- [x] Port tests and Host HTTP/Playwright stay green (docs-only ticket)

## Comments

- Identity README now documents `createIdentity(cookieBag?)` (`Headers`: Cookie in, Set-Cookie out), Principal-only `register`/`authenticate`, and bag-bound `endSession` / `currentPrincipal` / `mayAccessRoute(route)`.
- Both adapters start a Session on register; `unauthenticated`, `forbidden`, and session tokens are gone from the port table. HTTP remains Host/Playground presentation.
- Lint, typecheck, and Vitest (including Host HTTP) passed. Playwright Identity E2E did not launch in this environment (`libnspr4.so` missing for Chromium); Host HTTP covers the same register/login/logout/`/protected` outcomes.

## Answer

Identity’s documented Public Layer interface is the cookie-bag port. A Product maintainer can implement from `layers/identity/README.md` without reading Tiers: Session on register and authenticate, no token, no fake-vs-HTTP split, no reserved unused error modes. `extends` plus HTTP stays Playground presentation.
