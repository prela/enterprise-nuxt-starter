# 02: Cookie-bag Identity port at both seams

**What to build:** The Identity port is cookie-bag-bound. `register` and `authenticate` return a Principal and start a Session. `endSession`, `currentPrincipal`, and `mayAccessRoute` use the bag — no token. Both adapters substitute, including Session on register. Vendor cookie names stay inside Better Auth. Middleware uses one `/protected` policy and may skip construction on public routes. Unused `unauthenticated` and `forbidden` are gone. Verified at the Identity port and at Host HTTP/UI.

**Blocked by:** 01 Prefactor Identity bind and persistence boot

**Status:** resolved

- [x] `createIdentity` takes a cookie bag (empty by default); tests import only `@starter/identity/port`
- [x] `register` and `authenticate` return a Principal; successful calls append an httpOnly Session cookie to the bag
- [x] After register, `currentPrincipal` is that Principal and `mayAccessRoute('/protected')` is true without a separate authenticate
- [x] `endSession` takes no token; afterward `currentPrincipal` is null and `/protected` is denied
- [x] `mayAccessRoute` takes a route string; `/` and `/login` are allowed without a Principal; `/protected` and below are not
- [x] Wrong password and unknown email remain identical `invalid-credentials`; `validation` and `duplicate-email` unchanged
- [x] `unauthenticated` and `forbidden` are not on the port; `SessionToken` / `ActiveSession` are not on the Public Layer interface
- [x] Fake writes Identity’s Session cookie; Better Auth maps vendor names (including `__Secure-`) internally
- [x] Bind, handlers, middleware, and the login principal plugin call the bound port; they do not name vendor cookies or pass tokens
- [x] One policy function for `/protected`; middleware may skip bind on public routes; `/health` does not construct Identity
- [x] Host HTTP: register/login set httpOnly Session (not CSRF), no vendor cookie names in tests; protected redirect; logout replay fails; CSRF unchanged
- [x] Playwright Identity slice stays green
- [x] Lint, typecheck, 80% global / 95% domain and application-service gates still pass

## Comments

- Port is cookie-bag-bound: `createIdentity(cookieBag?)` (empty `Headers` by default). `register` and `authenticate` return a Principal and append an httpOnly Session cookie. `endSession`, `currentPrincipal`, and `mayAccessRoute(route)` take no token.
- Fake writes `identity.session`. Better Auth copies Set-Cookie as-is (including `__Secure-`); bind/handlers/middleware/plugin do not name vendor cookies.
- `unauthenticated` / `forbidden` dropped; `SessionToken` / `ActiveSession` left the Public Layer interface.
- Lint, typecheck, and coverage gates passed. Playwright Identity E2E did not launch in this environment (`libnspr4.so` missing for Chromium); Host HTTP covers the same register/login/logout/`/protected` outcomes.

## Answer

Identity’s Public Layer interface is the cookie-bag port. Both adapters start a Session on register and authenticate; Session is httpOnly Set-Cookie on the bag, not a token. Vendor cookie names stay inside Better Auth. Nitro bind, handlers, middleware, and the login principal plugin call that port. Verified at `@starter/identity/port` and Host HTTP.
