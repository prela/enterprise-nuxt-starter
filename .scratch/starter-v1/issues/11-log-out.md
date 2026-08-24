# 11: Log out

**What to build:** A member can log out and is then a visitor. The server session is invalidated; a replayed cookie does not restore access.

**Blocked by:** 09 Log in

**Status:** ready-for-agent

- [ ] Member can log out and is treated as a visitor afterward
- [ ] Server session is invalidated; replayed cookie cannot access the protected page
- [ ] CSRF on the logout action
- [ ] Port tests cover end-session; Host E2E covers logout then denied protected page
