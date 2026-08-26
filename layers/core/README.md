# Core Nuxt Layer — Public Layer interface

Products and the Playground Host may depend on `@starter/core` only through this interface.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/core'],
})
```

Do not import files under `layers/core/` (Tiers). Those paths are not public.

## Environment

| Variable | Meaning |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | Public origin of the Host (`http://localhost:3000` locally). Missing or non-URL values fail boot with a Zod error. |
| `NUXT_DATABASE_URL` | PostgreSQL URL (`postgres://` or `postgresql://`) mapped to Core `runtimeConfig.databaseUrl`. Missing, non-URL, or non-PostgreSQL values fail boot with a Zod error. Compose also sets `DATABASE_URL` to the same value for Identity Drizzle; that name is not a Core runtimeConfig key. |

Responses include baseline security headers from `nuxt-security`. CSP is sent as `Content-Security-Policy-Report-Only` in v1, not as an enforced `Content-Security-Policy`. State-changing requests (POST, PUT, PATCH) require a CSRF token (`csrf-token` header, issued as `<meta name="csrf-token">` on HTML responses).

## HTTP

| Method | Path | Contract |
| --- | --- | --- |
| `GET` | `/health` | Process is up. `Cache-Control` includes `no-store`. |
| `GET` | `/ready` | Process can serve traffic. `200` when PostgreSQL answers a Drizzle ping; `503` when it does not. `Cache-Control` includes `no-store`. |
