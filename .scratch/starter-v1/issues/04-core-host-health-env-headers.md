# 04: Core Host — health, env, headers

**What to build:** The Playground Host extends a Core Nuxt Layer. An operator can hit uncached health and readiness, a misconfigured process fails closed on env, and responses carry baseline security headers with CSP in report-only. Deep imports of another Layer’s Tiers fail lint. Verified at the Host HTTP seam.

**Blocked by:** 03 Root toolchain

**Status:** claimed

- [x] Host extends a Core Nuxt Layer with a documented Public Layer interface and its own package manifest
- [x] Health endpoint returns success and must not be cached
- [x] Readiness endpoint returns success only when the process is actually ready and must not be cached
- [x] Missing or invalid required env fails boot (or readiness) with a clear Zod failure — asserted via Host HTTP/startup, not by treating Zod schemas as a separate seam
- [x] Baseline security headers are present; CSP is report-only (not enforced)
- [x] Lint fails on a deep import of another Layer’s Tiers; Tiers inside Core may import within Core
- [x] Host HTTP tests cover health, readiness, no-cache, and headers
- [x] Product domains (PMS, rental, marketing) are not introduced

## Comments

- Playground Host `extends: ['@starter/core']`. Public interface is `layers/core/README.md`.
- `GET /health` and `GET /ready` return JSON with `Cache-Control: no-store`.
- Boot validates `NUXT_PUBLIC_SITE_URL` with Zod in a Nitro plugin (missing or non-URL fails closed). Persistence checks are not in this work package.
- `nuxt-security` is on Core; CSP is `Content-Security-Policy-Report-Only`.
- ESLint `no-restricted-imports` blocks Host (and later Nuxt Layers) from importing `layers/core` Tiers; Core files are exempt so intra-Core imports stay legal.
