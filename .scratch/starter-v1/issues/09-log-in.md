# 09: Log in

**What to build:** A member can log in with email and password, keep an httpOnly session across SSR refresh, and fail without revealing whether the email exists. Verified at the Identity port and Host HTTP/UI seams.

**Blocked by:** 08 Register end-to-end

**Status:** ready-for-agent

- [ ] Member can log in with email and password on an SSR form
- [ ] Invalid credentials fail without enumerating whether the email exists
- [ ] Session cookie is httpOnly; JavaScript cannot read it
- [ ] After refresh / SSR navigation the member is still authenticated
- [ ] CSRF on the login action
- [ ] Port tests and Host E2E cover happy login and non-enumerating failure
- [ ] No JWT-in-localStorage; no hosted IdP
