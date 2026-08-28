# Identity Nuxt Layer — Public Layer interface

Products and the Playground Host may depend on `@starter/identity` only through this interface. A Product may omit this Layer entirely.

The Public Layer interface is the Identity port (`createIdentity` and the port types). `extends` plus HTTP is Host/Playground presentation of that port, not a second Public Layer interface.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/identity'],
})
```

Do not import files under `layers/identity/` (Tiers). Those paths are not public. Do not import `#identity` from the Host.

Extending this Layer registers Playground presentation: `/register` and `/login` (SSR forms, `auth` layout), `/protected` (default layout, Identity `mayAccessRoute` middleware, logout action), `POST /api/identity/register`, `POST /api/identity/login`, and `POST /api/identity/logout`. The Host must not deep-import Better Auth, Drizzle tables, or Identity Tiers.

## Environment

| Variable | Meaning |
| --- | --- |
| `NUXT_BETTER_AUTH_SECRET` | Better Auth secret, at least 32 characters. Missing or short values fail boot with a Zod error. |
| `NUXT_DATABASE_URL` | PostgreSQL URL from Core. Identity applies its own Drizzle migrations to this engine. |
| `NUXT_PUBLIC_SITE_URL` | Public origin (Better Auth `baseURL`). |

## Port

```ts
import { createIdentity } from '@starter/identity/port'

const cookies = new Headers()
const identity = createIdentity(cookies)
```

`createIdentity` takes a cookie bag: the web `Headers` object, inbound `Cookie` in and outbound `Set-Cookie` out. The default bag is empty, so `createIdentity()` still constructs a port. Session lives on that bag as an httpOnly cookie. Successful `register` and `authenticate` append that cookie; they return a Principal only.

The in-memory fake and the Better Auth adapter both satisfy this port, including starting a Session on successful register. Do not import Better Auth, Clerk, Auth0, or Supabase Auth from this interface.

`register` and `authenticate` return `IdentityResult<Principal>`: `{ ok: true, data }` or `{ ok: false, error }`.

| Method | Success | Error modes |
| --- | --- | --- |
| `register({ email, password })` | Principal (`id`, `email`). Starts a Session. | `validation` (invalid email or password shorter than 8 characters), `duplicate-email` |
| `authenticate({ email, password })` | Principal (`id`, `email`). Starts a Session. | `invalid-credentials` (wrong password and unknown email are identical) |
| `endSession()` | Session is unusable afterward | — |
| `currentPrincipal()` | Principal, or `null` if there is no Session | — |
| `mayAccessRoute(route)` | `true` when the route does not require a member, or when the bag has a Principal | `false` for `/protected` (and below) without a Principal |

Do not store the Session in localStorage; it is an httpOnly cookie on the bag.

## HTTP

Host/Playground presentation. Status codes, the httpOnly Session cookie, and CSRF are Playground outcomes of the port, not a second Public Layer interface.

| Method | Path | Contract |
| --- | --- | --- |
| `GET` | `/register` | SSR form with email and password. CSRF token is issued as `<meta name="csrf-token">`. |
| `POST` | `/api/identity/register` | Requires CSRF (`csrf-token` header). `201` with `{ ok: true, data: { id, email } }` and an httpOnly Session cookie. `400` validation field errors. `409` `{ ok: false, error: { code: 'duplicate-email' } }`. `403` without CSRF. |
| `GET` | `/login` | SSR form with email and password. CSRF token is issued as `<meta name="csrf-token">`. With a Session cookie, the HTML includes the member email. |
| `POST` | `/api/identity/login` | Requires CSRF (`csrf-token` header). `200` with `{ ok: true, data: { id, email } }` and an httpOnly Session cookie. `401` `{ ok: false, error: { code: 'invalid-credentials' } }` for both wrong password and unknown email. `403` without CSRF. |
| `GET` | `/protected` | Member-only page. Anonymous visitors are redirected to `/login` (no member-only HTML). A Session cookie that `mayAccessRoute` allows receives `200` with the protected copy and a logout form. |
| `POST` | `/api/identity/logout` | Requires CSRF (`csrf-token` header). `200` `{ ok: true }`. The Session is invalidated so a replayed cookie cannot open `/protected`. `403` without CSRF. |

## Out of scope for this interface

OAuth, magic links, password reset, email verification, 2FA.
