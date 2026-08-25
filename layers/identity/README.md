# Identity Nuxt Layer — Public Layer interface

Products and the Playground Host may depend on `@starter/identity` only through this interface. A Product may omit this Layer entirely.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/identity'],
})
```

Do not import files under `layers/identity/` (Tiers). Those paths are not public.

The Playground Host does not extend this Layer in this work package; it will in a later one. Tests import the port below.

## Port

```ts
import { createIdentity } from '@starter/identity/port'
```

`createIdentity()` returns the Identity port backed by an in-memory fake. A later adapter (Better Auth) must satisfy the same methods and error codes. Do not import Better Auth, Clerk, Auth0, or Supabase Auth from this interface.

| Method | Success | Error modes |
| --- | --- | --- |
| `register({ email, password })` | Principal (`id`, `email`) | `validation` (invalid email or password shorter than 8 characters), `duplicate-email` |
| `authenticate({ email, password })` | `{ session, principal }` | `invalid-credentials` (wrong password and unknown email are identical) |
| `endSession(session)` | Session is unusable afterward | — |
| `currentPrincipal(session)` | Principal, or `null` if there is no session | `unauthenticated` is reserved for HTTP when a caller requires a principal and there is none |
| `mayAccessRoute({ session, route })` | `true` when the route does not require a member, or when the session has a principal | `false` for `/protected` (and below) without a principal; `forbidden` is reserved for HTTP when a principal is present but the route is not allowed |

Register does not start a session. Authenticate does. Session tokens are opaque; callers must not parse them.

## Out of scope for this interface

OAuth, magic links, password reset, email verification, 2FA, screens, and persistence. Identity HTTP and CSRF land with later work packages.
