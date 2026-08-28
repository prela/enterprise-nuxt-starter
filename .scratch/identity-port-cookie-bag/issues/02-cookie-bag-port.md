# 02: Cookie-bag Identity port at both seams

**What to build:** The Identity port is cookie-bag-bound. `register` and `authenticate` return a Principal and start a Session. `endSession`, `currentPrincipal`, and `mayAccessRoute` use the bag — no token. Both adapters substitute, including Session on register. Vendor cookie names stay inside Better Auth. Middleware uses one `/protected` policy and may skip construction on public routes. Unused `unauthenticated` and `forbidden` are gone. Verified at the Identity port and at Host HTTP/UI.

**Blocked by:** 01 Prefactor Identity bind and persistence boot

**Status:** ready-for-agent

- [ ] `createIdentity` takes a cookie bag (empty by default); tests import only `@starter/identity/port`
- [ ] `register` and `authenticate` return a Principal; successful calls append an httpOnly Session cookie to the bag
- [ ] After register, `currentPrincipal` is that Principal and `mayAccessRoute('/protected')` is true without a separate authenticate
- [ ] `endSession` takes no token; afterward `currentPrincipal` is null and `/protected` is denied
- [ ] `mayAccessRoute` takes a route string; `/` and `/login` are allowed without a Principal; `/protected` and below are not
- [ ] Wrong password and unknown email remain identical `invalid-credentials`; `validation` and `duplicate-email` unchanged
- [ ] `unauthenticated` and `forbidden` are not on the port; `SessionToken` / `ActiveSession` are not on the Public Layer interface
- [ ] Fake writes Identity’s Session cookie; Better Auth maps vendor names (including `__Secure-`) internally
- [ ] Bind, handlers, middleware, and the login principal plugin call the bound port; they do not name vendor cookies or pass tokens
- [ ] One policy function for `/protected`; middleware may skip bind on public routes; `/health` does not construct Identity
- [ ] Host HTTP: register/login set httpOnly Session (not CSRF), no vendor cookie names in tests; protected redirect; logout replay fails; CSRF unchanged
- [ ] Playwright Identity slice stays green
- [ ] Lint, typecheck, 80% global / 95% domain and application-service gates still pass

## Comments
