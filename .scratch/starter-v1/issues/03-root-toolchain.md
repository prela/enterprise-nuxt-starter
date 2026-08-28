# 03: Root toolchain

**What to build:** Anyone can run lint, typecheck, and test from the repo with the same commands CI will use. On the stock Host those commands exit zero.

**Blocked by:** 01 Init git

**Status:** resolved

- [x] Root scripts exist for lint, typecheck, and test
- [x] Lint (Antfu ESLint) reports zero errors
- [x] Typecheck (strict TypeScript) reports zero errors
- [x] Test runner (Vitest at minimum) runs and passes, even if the suite is still a placeholder
- [x] No global installs; only repo-defined scripts and tools

## Comments

- Root scripts are `pnpm lint`, `pnpm typecheck`, and `pnpm test`. They exit zero on the stock Host.
- Vitest is a placeholder (`passWithNoTests`) so this work package does not invent a third test seam.
- Antfu’s `pnpm/yaml-enforce-settings` is off: `trustPolicy: no-downgrade` rejects `semver@6.3.1` in the current lockfile.

