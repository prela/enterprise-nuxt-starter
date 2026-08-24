# 10: Protected page

**What to build:** A visitor who opens the protected page is sent to login. A member who is logged in sees the page. Route protection uses the Identity port (may-access-route / equivalent), not Better Auth types.

**Blocked by:** 09 Log in

**Status:** ready-for-agent

- [ ] Anonymous visit to the protected page redirects to login; no member-only content leaks
- [ ] Authenticated member can open the protected page
- [ ] Middleware/guards depend on the Identity port, not adapter types
- [ ] Host E2E covers both visitor and member paths
- [ ] No admin layout or extra Product screens
