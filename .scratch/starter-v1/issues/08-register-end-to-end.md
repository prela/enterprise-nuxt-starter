# 08: Register end-to-end

**What to build:** A visitor can register with email and password on an SSR form, see validation and duplicate-email errors, and persist as a user/session in PostgreSQL. Better Auth is the production adapter behind the Identity port. CSRF protects the register action. Verified at both seams.

**Blocked by:** 05 Playground home + UI shell; 06 Compose — Playground + PostgreSQL; 07 Identity port with fake adapter

**Status:** claimed

- [x] Visitor can register with email and password; first paint is a real SSR form
- [x] Invalid email and weak password show field errors; duplicate email fails clearly
- [x] Better Auth (self-hosted) implements the port; credentials live in our PostgreSQL via Drizzle migrations owned by the Identity Layer
- [x] In-memory fake remains for port tests; those tests still pass
- [x] Host E2E covers happy register and the error cases above
- [x] CSRF protection on the register action
- [x] httpOnly session cookie is set on successful register (or on the subsequent login if register does not start a session — then login ticket owns the cookie; do not use JWT in localStorage)
- [x] Pinia stays thin; register rules live in application services
- [x] Host extends Identity only through the Public Layer interface
- [x] OAuth, magic links, password reset, email verification, and 2FA are not in this ticket

## Comments

- Playground Host `extends: ['@starter/core', '@starter/ui', '@starter/identity']`. Public interface is `layers/identity/README.md`. Host pages do not deep-import Identity Tiers.
- `GET /register` is an SSR form (email, password, submit) on the UI `auth` layout. `POST /api/identity/register` calls the Identity port.
- Core enables `nuxt-security` CSRF. Register without a `csrf-token` header is `403`.
- Better Auth + Drizzle (PostgreSQL) is the production adapter. Migrations live in `layers/identity/drizzle/`. The in-memory fake remains `createIdentity()` for port tests.
- Host HTTP covers first paint, CSRF rejection, invalid email, weak password, happy register, duplicate email (including after Host restart), and an httpOnly session cookie that is not the CSRF cookie.

## Answer

A visitor can register on an SSR form. Validation and duplicate-email errors are returned from the Identity application service. Credentials persist in PostgreSQL via Identity-owned Drizzle migrations and Better Auth. CSRF protects the register action; successful register sets an httpOnly session cookie. Port tests still use the in-memory fake.
