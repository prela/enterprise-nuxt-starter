# 11: Log out

**What to build:** A member can log out and is then a visitor. The server session is invalidated; a replayed cookie does not restore access.

**Blocked by:** 09 Log in

**Status:** resolved

- [x] Member can log out and is treated as a visitor afterward
- [x] Server session is invalidated; replayed cookie cannot access the protected page
- [x] CSRF on the logout action
- [x] Port tests cover end-session; Host E2E covers logout then denied protected page

## Comments

- Logout is a POST action (`POST /api/identity/logout`), not a GET page, so CSRF can protect it. The protected page SSRs a native form that posts to that path.
- The handler calls Identity `endSession`. Better Auth `signOut` deletes the server session; a replayed httpOnly cookie then fails `mayAccessRoute` and `/protected` sends the visitor to `/login`.
- Core CSRF already rejects logout POST without `csrf-token` (`403`). Port tests already cover `endSession` (principal is forgotten). Host HTTP covers CSRF, the logout control, visitor treatment, and cookie replay.

## Answer

A member can log out from the protected page. The server session is invalidated, so a replayed cookie cannot open `/protected`. CSRF protects the logout action. Port tests remain on the in-memory fake; Host HTTP covers logout then denied protected page.
