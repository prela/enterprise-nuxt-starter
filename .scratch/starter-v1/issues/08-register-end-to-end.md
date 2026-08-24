# 08: Register end-to-end

**What to build:** A visitor can register with email and password on an SSR form, see validation and duplicate-email errors, and persist as a user/session in PostgreSQL. Better Auth is the production adapter behind the Identity port. CSRF protects the register action. Verified at both seams.

**Blocked by:** 05 Playground home + UI shell; 06 Compose — Playground + PostgreSQL; 07 Identity port with fake adapter

**Status:** ready-for-agent

- [ ] Visitor can register with email and password; first paint is a real SSR form
- [ ] Invalid email and weak password show field errors; duplicate email fails clearly
- [ ] Better Auth (self-hosted) implements the port; credentials live in our PostgreSQL via Drizzle migrations owned by the Identity Layer
- [ ] In-memory fake remains for port tests; those tests still pass
- [ ] Host E2E covers happy register and the error cases above
- [ ] CSRF protection on the register action
- [ ] httpOnly session cookie is set on successful register (or on the subsequent login if register does not start a session — then login ticket owns the cookie; do not use JWT in localStorage)
- [ ] Pinia stays thin; register rules live in application services
- [ ] Host extends Identity only through the Public Layer interface
- [ ] OAuth, magic links, password reset, email verification, and 2FA are not in this ticket
