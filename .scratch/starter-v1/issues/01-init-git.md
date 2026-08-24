# 01: Init git

**What to build:** The Starter is a git repository agents can branch from: `develop` is the default integration branch, `main` exists for releases, and ignore rules keep generated and secret files out of history.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Git is initialized with `develop` as the default branch and `main` present
- [x] Ignore rules exclude dependencies, Nuxt build output, env files, and other generated artifacts
- [x] Agents can create `feature/<id>-<slug>` branches from `develop`
- [x] No commit lands directly on `main` as part of this ticket

## Comments

- Init commit is `1980501` (`chore: initialize git with develop as the default branch.`). GitHub default branch is `develop`.
- `main` exists and still points at that init commit; later work landed via PRs into `develop` only.
- Ignore rules cover Nuxt output, `node_modules`, env files, coverage, Playwright artifacts, and `*.local`.
- Follow-on branches `feature/02-private-github-remote` and `feature/03-root-toolchain` were created from `develop`.
