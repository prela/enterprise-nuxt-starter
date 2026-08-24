# 15: Production from SemVer tag on main

**What to build:** A release PR from `develop` into `main`, then a SemVer tag on `main`, deploys the Playground to production on Coolify. Production is an intentional release, not every merge.

**Blocked by:** 14 Coolify preview from develop

**Status:** ready-for-agent

- [ ] Release path is a PR `develop` → `main` (not a direct push)
- [ ] A SemVer tag on `main` deploys production Playground on Coolify
- [ ] Production smoke checks health, headers, and CSP report-only
- [ ] Version is lockstep `0.y.z` for all Nuxt Layers; this ticket does not bump to `1.0.0` (that waits until a production Product depends on the Starter)
- [ ] Work package IDs are not used as SemVer tags
- [ ] Conventional Commits remain the changelog input
