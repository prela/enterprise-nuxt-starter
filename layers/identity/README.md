# Identity Nuxt Layer — Public Layer interface

Products and the Playground Host may depend on `@starter/identity` only through this interface. A Product may omit this Layer entirely.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/identity'],
})
```

Do not import files under `layers/identity/` (Tiers). Those paths are not public. Do not import `#identity` from the Host.

Extending this Layer registers `/register` and `/login` (SSR forms, `auth` layout), `/protected` (default layout, Identity `mayAccessRoute` middleware), `POST /api/identity/register`, and `POST /api/identity/login`. The Host must not deep-import Better Auth, Drizzle tables, or Identity Tiers.

## Environment

| Variable | Meaning |
| --- | --- |
| `NUXT_BETTER_AUTH_SECRET` | Better Auth secret, at least 32 characters. Missing or short values fail boot with a Zod error. |
| `NUXT_DATABASE_URL` | PostgreSQL URL from Core. Identity applies its own Drizzle migrations to this engine. |
| `NUXT_PUBLIC_SITE_URL` | Public origin (Better Auth `baseURL`). |

## Port

```ts
import { createIdentity } from '@starter/identity/port'
```

`createIdentity()` returns the Identity port backed by an in-memory fake. Production uses a Better Auth adapter that satisfies the same methods and error codes. Do not import Better Auth, Clerk, Auth0, or Supabase Auth from this interface.

| Method | Success | Error modes |
| --- | --- | --- |
| `register({ email, password })` | Principal (`id`, `email`) | `validation` (invalid email or password shorter than 8 characters), `duplicate-email` |
| `authenticate({ email, password })` | `{ session, principal }` | `invalid-credentials` (wrong password and unknown email are identical) |
| `endSession(session)` | Session is unusable afterward | — |
| `currentPrincipal(session)` | Principal, or `null` if there is no session | `unauthenticated` is reserved for HTTP when a caller requires a principal and there is none |
| `mayAccessRoute({ session, route })` | `true` when the route does not require a member, or when the session has a principal | `false` for `/protected` (and below) without a principal; `forbidden` is reserved for HTTP when a principal is present but the route is not allowed |

The in-memory fake’s `register` does not start a session. The Better Auth adapter sets an httpOnly session cookie on successful `POST /api/identity/register` and `POST /api/identity/login`. Session tokens are opaque; callers must not parse them. Do not store a JWT in localStorage.

## HTTP

| Method | Path | Contract |
| --- | --- | --- |
| `GET` | `/register` | SSR form with email and password. CSRF token is issued as `<meta name="csrf-token">`. |
| `POST` | `/api/identity/register` | Requires CSRF (`csrf-token` header). `201` with `{ ok: true, data: { id, email } }` and an httpOnly session cookie. `400` validation field errors. `409` `{ ok: false, error: { code: 'duplicate-email' } }`. `403` without CSRF. |
| `GET` | `/login` | SSR form with email and password. CSRF token is issued as `<meta name="csrf-token">`. With a session cookie, the HTML includes the member email. |
| `POST` | `/api/identity/login` | Requires CSRF (`csrf-token` header). `200` with `{ ok: true, data: { id, email } }` and an httpOnly session cookie. `401` `{ ok: false, error: { code: 'invalid-credentials' } }` for both wrong password and unknown email. `403` without CSRF. |
| `GET` | `/protected` | Member-only page. Anonymous visitors are redirected to `/login` (no member-only HTML). A session cookie that `mayAccessRoute` allows receives `200` with the protected copy. |

## Out of scope for this interface

OAuth, magic links, password reset, email verification, 2FA. Logout HTTP lands in a later work package.
