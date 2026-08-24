# 03: Root toolchain

**What to build:** Anyone can run lint, typecheck, and test from the repo with the same commands CI will use. On the stock Host those commands exit zero.

**Blocked by:** 01 Init git

**Status:** ready-for-agent

- [ ] Root scripts exist for lint, typecheck, and test
- [ ] Lint (Antfu ESLint) reports zero errors
- [ ] Typecheck (strict TypeScript) reports zero errors
- [ ] Test runner (Vitest at minimum) runs and passes, even if the suite is still a placeholder
- [ ] No global installs; only repo-defined scripts and tools
