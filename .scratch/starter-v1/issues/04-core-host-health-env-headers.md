# 04: Core Host — health, env, headers

**What to build:** The Playground Host extends a Core Nuxt Layer. An operator can hit uncached health and readiness, a misconfigured process fails closed on env, and responses carry baseline security headers with CSP in report-only. Deep imports of another Layer’s Tiers fail lint. Verified at the Host HTTP seam.

**Blocked by:** 03 Root toolchain

**Status:** ready-for-agent

- [ ] Host extends a Core Nuxt Layer with a documented Public Layer interface and its own package manifest
- [ ] Health endpoint returns success and must not be cached
- [ ] Readiness endpoint returns success only when the process is actually ready and must not be cached
- [ ] Missing or invalid required env fails boot (or readiness) with a clear Zod failure — asserted via Host HTTP/startup, not by treating Zod schemas as a separate seam
- [ ] Baseline security headers are present; CSP is report-only (not enforced)
- [ ] Lint fails on a deep import of another Layer’s Tiers; Tiers inside Core may import within Core
- [ ] Host HTTP tests cover health, readiness, no-cache, and headers
- [ ] Product domains (PMS, rental, marketing) are not introduced
