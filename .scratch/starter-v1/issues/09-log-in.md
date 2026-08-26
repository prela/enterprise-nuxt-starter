# 09: Log in

**What to build:** A member can log in with email and password, keep an httpOnly session across SSR refresh, and fail without revealing whether the email exists. Verified at the Identity port and Host HTTP/UI seams.

**Blocked by:** 08 Register end-to-end

**Status:** resolved

- [x] Member can log in with email and password on an SSR form
- [x] Invalid credentials fail without enumerating whether the email exists
- [x] Session cookie is httpOnly; JavaScript cannot read it
- [x] After refresh / SSR navigation the member is still authenticated
- [x] CSRF on the login action
- [x] Port tests and Host E2E cover happy login and non-enumerating failure
- [x] No JWT-in-localStorage; no hosted IdP

## Comments

- `GET /login` is an SSR form (email, password, submit) on the UI `auth` layout. `POST /api/identity/login` calls Identity `authenticate`.
- Wrong password and unknown email both return `401` `{ ok: false, error: { code: 'invalid-credentials' } }`. The form shows one generic message.
- Successful login sets an httpOnly session cookie (not the CSRF cookie; not a JWT in JSON or localStorage).
- After login, `GET /login` with that cookie still SSR-renders `Signed in as <email>` — the principal comes from `currentPrincipal` via a Nitro request hook, not from adapter types in the Host.
- Core CSRF already rejects login POST without `csrf-token` (`403`). Port tests on develop already cover authenticate happy path and non-enumeration; Host HTTP adds the login form and cookie/SSR cases.
- Playground home links to `/login`. No hosted IdP.

## Answer

A member can log in on an SSR form. Invalid credentials fail as identical `invalid-credentials` errors. The session is an httpOnly cookie; SSR navigation still shows the principal. CSRF protects the login action. Port tests remain on the in-memory fake; Host HTTP covers happy login and non-enumerating failure.
