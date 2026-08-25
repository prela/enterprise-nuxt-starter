# 07: Identity port with fake adapter

**What to build:** The Identity Nuxt Layer’s Public Layer interface is real: register, authenticate, end session, current principal, may-access-route. Application-service tests pass against an in-memory fake. Better Auth and Drizzle are not in this ticket. TDD at the Identity port seam (red first).

**Blocked by:** 04 Core Host — health, env, headers

**Status:** claimed

- [x] Identity Nuxt Layer exists with a documented Public Layer interface (the port) and its own package manifest
- [x] In-memory fake adapter satisfies the port; no Better Auth, Clerk, Auth0, or Supabase Auth
- [x] Tests at the Identity port cover: register happy path, invalid email, weak password, duplicate email; authenticate happy path; wrong password and unknown email without enumeration; principal after authenticate; end session; may-access-route for anonymous vs authenticated
- [x] Tests would still pass if a different adapter later satisfied the same port
- [x] Domain and application-service modules are structured so the 95% coverage gate can apply to them
- [x] Host still must not deep-import Identity Tiers
- [x] A future Product can omit this Layer; the Playground may extend it later without this ticket adding screens

## Comments

- Public interface is `layers/identity/README.md` and `@starter/identity/port` (`createIdentity`). No Better Auth, Clerk, Auth0, or Supabase Auth.
- In-memory fake implements the Identity port in `application/create-identity.ts`. Tests import only `@starter/identity/port`.
- Port tests: register (happy, invalid email, weak password, duplicate email); authenticate (happy, wrong password and unknown email as identical `invalid-credentials`); principal after authenticate; end session; may-access-route for `/protected` vs `/` and anonymous vs authenticated.
- Domain lives under `layers/identity/domain/`; application service under `layers/identity/application/` for the later 95% coverage gate.
- ESLint fence blocks Host/Core/UI deep imports of Identity Tiers; Identity Tiers may import within Identity. Lint fixture covers an Identity Tier import from `app/`.
- Host does not `extends` Identity and adds no screens. Root depends on `@starter/identity` so port tests can import the public entrypoint. A Product omits the Layer by not depending on the package.
