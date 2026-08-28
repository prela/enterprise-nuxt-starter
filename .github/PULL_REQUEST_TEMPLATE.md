## Summary

<!-- What this work package changed, and why. -->

-

## Test plan

<!-- How this was verified. Keep the toolchain checks; add Host HTTP / Identity-port / Playwright steps when the package has those seams. -->

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:e2e`

## Target

`develop` for work-package PRs. Release PRs are `develop` → `main` only. Conventional Commits (`feat:`, `fix:`, `BREAKING CHANGE:`) are the changelog; do not tag work package IDs (`0.1`, `6.2`).
