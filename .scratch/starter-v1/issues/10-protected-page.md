# 10: Protected page

**What to build:** A visitor who opens the protected page is sent to login. A member who is logged in sees the page. Route protection uses the Identity port (may-access-route / equivalent), not Better Auth types.

**Blocked by:** 09 Log in

**Status:** resolved

- [x] Anonymous visit to the protected page redirects to login; no member-only content leaks
- [x] Authenticated member can open the protected page
- [x] Middleware/guards depend on the Identity port, not adapter types
- [x] Host E2E covers both visitor and member paths
- [x] No admin layout or extra Product screens

## Comments

- `GET /protected` is an SSR page on the UI `default` layout (not auth, not admin). Member-only copy is `Identity is working.`
- Nitro middleware in the Identity Layer calls `mayAccessRoute` with the session from `sessionTokenFromEvent`. Anonymous visitors are redirected to `/login` before that HTML is rendered. Middleware does not import Better Auth types.
- Host HTTP covers visitor (lands on login, no member copy) and member (login cookie, `200` with protected copy). Port tests already cover `mayAccessRoute` for anonymous vs authenticated.

## Answer

A visitor who opens `/protected` is sent to `/login` and never sees member-only HTML. A logged-in member sees the protected page. Route protection uses Identity `mayAccessRoute`, not adapter types.
