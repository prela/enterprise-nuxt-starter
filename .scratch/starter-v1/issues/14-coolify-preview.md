# 14: Coolify preview from develop

**What to build:** The owner can open a Coolify preview of the Playground deployed from `develop`, with smoke checks on health, headers, and CSP report-only.

**Blocked by:** 06 Compose — Playground + PostgreSQL; 12 CI on PRs to develop

**Status:** ready-for-agent

- [ ] Merges to `develop` (or the agreed preview pipeline) deploy a Playground preview on Coolify
- [ ] Preview smoke checks health, readiness, security headers, and CSP report-only
- [ ] Preview uses PostgreSQL; secrets are not in git
- [ ] Owner can complete register/login on the preview (Identity slice is already in `develop` via 12’s blockers)
