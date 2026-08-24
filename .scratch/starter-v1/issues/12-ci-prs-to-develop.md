# 12: CI on PRs to develop

**What to build:** Every PR into `develop` runs lint, typecheck, Identity-port tests, and Playwright. A red slice cannot merge.

**Blocked by:** 02 Private GitHub remote; 11 Log out

**Status:** ready-for-agent

- [ ] GitHub Actions on PRs to `develop` run lint, typecheck, unit tests at the Identity port, and Playwright at the Host HTTP/UI seam
- [ ] A failing job blocks merge
- [ ] CI uses repo scripts only (no global installs on the runner beyond what the workflow installs from the lockfile)
- [ ] Playwright covers register → login → protected page → logout (11 implies 08–10 are present)
