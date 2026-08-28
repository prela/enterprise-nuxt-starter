# Identity port owns Session as a cookie bag

Status: ready-for-agent

## Problem Statement

Identity’s Public Layer interface is a port that returns a session token. The Host and every Product observe an httpOnly Session cookie instead. The in-memory fake does not start a Session on register; production HTTP does. Host tests and Nitro wiring name Better Auth’s cookie. Callers and tests cannot treat the two adapters as substitutes, and a third H3-shaped “Identity request” module would only split the seam further.

## Solution

Make the Identity port cookie-bag-bound: request cookies in, Set-Cookie out. `register` and `authenticate` both return a Principal and both start a Session. `endSession`, `currentPrincipal`, and `mayAccessRoute` use the bag, not a token. Both adapters substitute. Vendor cookie names stay inside the Better Auth adapter. Nitro stays a small bind. Tests stay at the two existing seams.

## User Stories

1. As a future Product maintainer, I want Identity’s Public Layer interface to be the port, so that I am not locked to Better Auth or to a second HTTP contract.
2. As a future Product maintainer, I want that port to own Session as an httpOnly cookie, so that I do not receive a token I must not store and a cookie I cannot ignore.
3. As a future Product maintainer, I want `createIdentity` to accept a cookie bag, so that port tests and a future adapter share one Session contract.
4. As a future Product maintainer, I want `register` and `authenticate` to return a Principal only, so that Session is not a second value on the success payload.
5. As a future Product maintainer, I want `endSession`, `currentPrincipal`, and `mayAccessRoute` to take no session token, so that the bag is the only Session.
6. As a future Product maintainer, I want unused `unauthenticated` and `forbidden` codes gone from the port, so that I do not implement error modes nothing returns.
7. As a future Product maintainer, I want to omit the Identity Nuxt Layer entirely, so that a marketing Product is not forced to register users.
8. As a future Product maintainer, I want deep imports of Identity Tiers to still fail CI, so that Drizzle tables and Better Auth cannot become the interface.
9. As an agent, I want both adapters to start a Session on successful register, so that the fake and Better Auth substitute.
10. As an agent, I want both adapters to start a Session on successful authenticate, so that login is the same contract as register.
11. As an agent, I want `currentPrincipal` after register to return that Principal, so that register-starts-Session is observable at the port.
12. As an agent, I want `mayAccessRoute` for `/protected` to be true after register without a separate authenticate, so that Playground “register and continue” matches the port.
13. As an agent, I want `endSession` to make `currentPrincipal` null and `mayAccessRoute('/protected')` false, so that logout is observable at the port.
14. As an agent, I want Set-Cookie on the bag after register and authenticate to be httpOnly and not a CSRF cookie, so that Session is not a page-script value.
15. As an agent, I want the fake to write Identity’s Session cookie, not a Better Auth cookie name, so that vendor names do not leak into port tests.
16. As an agent, I want the Better Auth adapter to map vendor cookie names internally, so that the bind and Host tests do not mention `better-auth.session_token`.
17. As an agent, I want HTTPS preview Sessions to keep working, so that the `__Secure-` prefix stays an adapter concern.
18. As an agent, I want invalid email and weak password on register to stay `validation` with field messages, so that the fake and Better Auth still reject the same inputs.
19. As an agent, I want duplicate email to stay `duplicate-email`, so that adapters do not invent a parallel vocabulary.
20. As an agent, I want wrong password and unknown email to stay identical `invalid-credentials`, so that accounts cannot be enumerated at the port.
21. As an agent, I want `mayAccessRoute` to allow `/` and `/login` without a Principal, so that public Playground routes are not member-only.
22. As an agent, I want `mayAccessRoute` to deny `/protected` and `/protected/...` without a Principal, so that Identity’s only member-only route stays that path.
23. As an agent, I want no Product-supplied protected-route list in this work, so that v1 does not invent a second adapter at a one-Product seam.
24. As an agent, I want one policy function for `/protected`, so that middleware and `mayAccessRoute` do not each hardcode the path.
25. As an agent, I want middleware to skip Identity construction on public routes using that same function, so that Core `/health` does not become an Identity client.
26. As an agent, I want Nitro Identity wiring to stay a small bind (config plus cookie bag onto the port), so that there is no H3-shaped Identity-request module.
27. As an agent, I want auth-instance cache and migrate-on-demand inside the Better Auth adapter, so that the bind does not own persistence boot.
28. As an agent, I want Identity handlers to call the bound port and map existing error codes to HTTP status, so that presentation stays thin.
29. As an agent, I want login, register, and logout HTTP to still set and clear the Session cookie, so that Playground behaviour does not regress.
30. As an agent, I want login JSON to keep returning id and email without a token, so that the page cannot stash a Session in localStorage.
31. As an agent, I want the attach-principal plugin to bind, call `currentPrincipal`, and set event context, so that the port never knows Nitro context.
32. As a Playground visitor, I want to register with email and password and immediately be a member, so that I can open `/protected` without a second login.
33. As a Playground visitor, I want validation and duplicate-email failures on register to stay as they are, so that I can correct the form.
34. As a Playground member, I want to log in with email and password and receive an httpOnly Session cookie, so that JavaScript on the page cannot steal the Session.
35. As a Playground visitor, I want login to fail without revealing whether the email exists, so that accounts cannot be enumerated cheaply.
36. As a Playground member, I want to stay a Principal across SSR refresh, so that `/protected` does not bounce me to login.
37. As a Playground visitor, I want `/protected` to redirect me to `/login`, so that I never see member-only content.
38. As a Playground member, I want `/login` SSR to show my email when I already have a Session, so that I can see I am signed in.
39. As a Playground member, I want logout to invalidate the Session, so that a replayed cookie cannot open `/protected`.
40. As a Playground member, I want CSRF on register, login, and logout to stay required, so that a third-party site cannot change my Session.
41. As an operator, I want `/health` to stay a Core probe that does not construct Identity, so that liveness does not depend on Identity persistence.
42. As CI, I want Identity port tests to import only `@starter/identity/port`, so that Tiers are not the test surface.
43. As CI, I want Host HTTP tests to assert httpOnly Session cookies without naming Better Auth, so that swapping the adapter does not rewrite Host tests.
44. As CI, I want existing Host HTTP coverage of CSRF, validation, duplicate email, invalid credentials, protected redirect, and logout replay to keep passing, so that the Playground slice does not regress.
45. As CI, I want Playwright Identity E2E to keep passing, so that the visitor path still works in a browser.
46. As the owner, I want 80% coverage globally and 95% on Identity domain and application-service modules, so that Vue glue is not chased to 95%.
47. As the owner, I want no third test seam on the Nitro bind, so that `identityFromEvent` is not a public interface.
48. As an agent, I want Identity’s README to document the cookie-bag port and drop the fake-vs-HTTP Session divergence, so that the Public Layer interface matches ADR-0010.
49. As an agent, I want hard-to-reverse Session-on-the-port shape recorded as ADR-0010, so that a later review does not put a token back on the interface.
50. As an agent, I want glossary terms Principal and Session used in tests and docs, so that I do not call Session a token or Identity “auth.”

## Implementation Decisions

- **Public Layer interface:** Remains the Identity port (`createIdentity` and the port types). `extends` plus HTTP is Host/Playground presentation, not a second Public Layer interface. ADR-0002, ADR-0008, ADR-0010.
- **Cookie bag:** Adapters are constructed with a bag: inbound request cookies and outbound Set-Cookie. Default bag is empty so `createIdentity()` still works for tests that then read the bag they passed. The web `Headers` object is the bag.
- **Port methods:** `register({ email, password })` → `IdentityResult<Principal>`. `authenticate({ email, password })` → `IdentityResult<Principal>`. `endSession()` → `Promise<void>`. `currentPrincipal()` → `Promise<Principal | null>`. `mayAccessRoute(route: string)` → `Promise<boolean>`. No session token parameter or return field.
- **Session on success:** Successful `register` and `authenticate` append an httpOnly Session cookie to the bag. They do not return a token. `ActiveSession` and `SessionToken` leave the Public Layer interface.
- **Error modes:** `validation` (fields), `duplicate-email`, `invalid-credentials`. Drop `unauthenticated` and `forbidden`.
- **Route policy:** Identity owns `/protected` and `/protected/...` as the only member-only routes in v1. One policy function used by `mayAccessRoute` and by middleware’s construction skip. No Product-supplied list.
- **Adapters:** In-memory fake and Better Auth both satisfy the cookie-bag port, including Session on register. Better Auth maps vendor cookie names and `__Secure-` internally. The fake writes Identity’s Session cookie.
- **Persistence boot:** Auth-instance cache and migrate-on-demand live in the Better Auth adapter, not in the Nitro bind.
- **Nitro bind:** Parses Identity runtime config, builds a cookie bag from the request, constructs the Better Auth Identity port, returns that port. Applies outbound Set-Cookie onto the HTTP response. Does not know vendor cookie names. Not a documented Public Layer interface. Not a third test seam.
- **Handlers:** Thin: read body, call the bound port, map `validation` → 400, `duplicate-email` → 409, `invalid-credentials` → 401, apply cookies, return Principal fields only (no token). CSRF stays as today.
- **Middleware:** Skip bind when the shared policy says the route is public. Otherwise bind, `mayAccessRoute(pathname)`, redirect to `/login` if false.
- **Login principal plugin:** Presentation only: bind, `currentPrincipal()`, assign event context. Port does not know event context.
- **HTTP Host contract (unchanged outcomes):** Register 201 + httpOnly Session cookie; login 200 + cookie; logout 200 + Session unusable; anonymous `/protected` → `/login`; CSRF 403 without token. Login/register JSON bodies stay Principal-shaped.
- **Docs:** Identity README matches the cookie-bag port. Starter v1 spec’s “authenticate returns session” and reserved HTTP error modes are superseded by this spec and ADR-0010 for Identity’s port.
- **No schema change:** Drizzle user/session tables stay as they are. No new persistence port.

## Testing Decisions

- **Good tests** assert observable behavior at a seam. They do not assert Better Auth function names, vendor cookie names, Drizzle schema, Vue internals, Nitro bind internals, or file layout. A test that would break when swapping Better Auth for another adapter that still satisfies the cookie-bag port is testing the wrong seam.
- **Seams:** Two existing seams only. No new seam.
  - **Seam 1 — Identity port:** Tests import `@starter/identity/port` only. Pass a cookie bag into `createIdentity`. Cover: register happy (Principal + Session cookie + `currentPrincipal` + `mayAccessRoute('/protected')`); invalid email; weak password; duplicate email; authenticate happy (Principal + cookie); invalid-credentials identical for wrong password and unknown email; `endSession` then `currentPrincipal` null and `/protected` denied; public routes allowed without a Principal; `/protected` denied without a Principal. Do not assert a session token. Do not assert Better Auth cookie names.
  - **Seam 2 — Host HTTP/UI:** Existing Host HTTP tests for register, login, logout, protected, plus Playwright Identity E2E. Assert httpOnly Session (not CSRF) without naming Better Auth. Keep CSRF, validation, duplicate-email, invalid-credentials, protected redirect, logout replay. `/health` must not require Identity persistence.
- **Not tested as seams:** The Nitro bind, Better Auth internals, cookie-name mapping, migrate cache, `attach-principal` plugin internals, UI atoms.
- **Prior art:** `test/identity-port/identity-port.spec.ts` (seam 1). `test/host-http/register.spec.ts`, `login.spec.ts`, `logout.spec.ts`, `protected.spec.ts` (seam 2 HTTP). `test/host-ui/identity-slice.e2e.ts` (seam 2 UI). Rewrite seam 1 tests that pass a session token; strip vendor cookie names from seam 2.
- **TDD:** Red first at seam 1 for the cookie-bag port, then the fake. Seam 2 stays green for Playground outcomes; change assertions that couple to vendor cookie names.
- **Gates:** Lint, typecheck, tests, 80% global / 95% domain and application-service modules. Infrastructure and server remain outside the 95% pool; seam 2 covers them.

## Out of Scope

- Reopening ADR-0002 to make HTTP or `extends` the Public Layer interface.
- A deep Identity-request module or any third test seam.
- Product- or Host-supplied protected-route lists.
- OAuth, magic links, password reset, email verification, 2FA.
- Clerk, Auth0, Supabase Auth, or any second production adapter.
- Changing CSRF, Core health/ready, UI layouts, or persistence schema.
- Enforcing CSP; i18n; Nuxt Content.

## Further Notes

Grilling produced this shape; ADR-0010 records it. Glossary: Identity, Principal, Session, Public Layer interface, Nuxt Layer, Host, Playground, Product. Next: `/to-tickets`.
