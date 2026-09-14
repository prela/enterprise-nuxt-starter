# 03: Release PR and tag v0.1.0

**Parent:** `.scratch/lockstep-0.1.0/spec.md`

**What to build:** Production Playground deploys from lockstep `0.1.0`. A release PR takes `develop` into `main`; a `v0.1.0` tag on `main`’s tip hits the Coolify production webhook; production smoke is green. Merging `main` does not deploy. Feature branches do not target `main`. This is not a Work package id and not `1.0.0`.

**Blocked by:** 02 Lockstep 0.1.0 and honest docs (7.7)

**Status:** ready-for-agent

- [ ] Release PR is `develop` → `main` (not a feature branch, not a direct push)
- [ ] `ci` is green on the release PR head before merge
- [ ] Tag `v0.1.0` is `main`’s tip and matches lockstep `0.1.0`
- [ ] Production Coolify application deploys from that tag (Auto Deploy stays off)
- [ ] Production smoke passes the `7.6` contract
- [ ] No `1.0.0`; no npm publish; no docs Product
