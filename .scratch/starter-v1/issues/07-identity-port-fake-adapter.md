# 07: Identity port with fake adapter

**What to build:** The Identity Nuxt Layer’s Public Layer interface is real: register, authenticate, end session, current principal, may-access-route. Application-service tests pass against an in-memory fake. Better Auth and Drizzle are not in this ticket. TDD at the Identity port seam (red first).

**Blocked by:** 04 Core Host — health, env, headers

**Status:** ready-for-agent

- [ ] Identity Nuxt Layer exists with a documented Public Layer interface (the port) and its own package manifest
- [ ] In-memory fake adapter satisfies the port; no Better Auth, Clerk, Auth0, or Supabase Auth
- [ ] Tests at the Identity port cover: register happy path, invalid email, weak password, duplicate email; authenticate happy path; wrong password and unknown email without enumeration; principal after authenticate; end session; may-access-route for anonymous vs authenticated
- [ ] Tests would still pass if a different adapter later satisfied the same port
- [ ] Domain and application-service modules are structured so the 95% coverage gate can apply to them
- [ ] Host still must not deep-import Identity Tiers
- [ ] A future Product can omit this Layer; the Playground may extend it later without this ticket adding screens
