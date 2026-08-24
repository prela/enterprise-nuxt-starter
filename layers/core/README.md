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

Responses include baseline security headers from `nuxt-security`. CSP is sent as `Content-Security-Policy-Report-Only` in v1, not as an enforced `Content-Security-Policy`.

## HTTP

| Method | Path | Contract |
| --- | --- | --- |
| `GET` | `/health` | Process is up. `Cache-Control` includes `no-store`. |
| `GET` | `/ready` | Process can serve traffic. `Cache-Control` includes `no-store`. Persistence checks join this probe when Identity exists. |
