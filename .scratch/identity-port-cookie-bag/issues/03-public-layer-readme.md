# 03: Public Layer README matches the cookie-bag port

**What to build:** Identity’s documented Public Layer interface matches the cookie-bag port: Session on register and authenticate, no token, no fake-vs-HTTP divergence, no reserved unused error modes. A Product maintainer can implement from the README without reading Tiers.

**Blocked by:** 02 Cookie-bag Identity port at both seams

**Status:** ready-for-agent

- [ ] README documents `createIdentity` with a cookie bag and the port methods as they shipped in 02
- [ ] README states both adapters start a Session on register; the old fake-vs-HTTP split is gone
- [ ] README does not document a session token, `unauthenticated`, or `forbidden` on the port
- [ ] README still describes `extends` plus HTTP as Host/Playground presentation, not a second Public Layer interface
- [ ] HTTP table still matches Playground outcomes (status codes, httpOnly cookie, CSRF)
- [ ] Port tests and Host HTTP/Playwright stay green (docs-only ticket)

## Comments
