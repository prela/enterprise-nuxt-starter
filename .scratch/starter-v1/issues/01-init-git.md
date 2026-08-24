# 01: Init git

**What to build:** The Starter is a git repository agents can branch from: `develop` is the default integration branch, `main` exists for releases, and ignore rules keep generated and secret files out of history.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Git is initialized with `develop` as the default branch and `main` present
- [ ] Ignore rules exclude dependencies, Nuxt build output, env files, and other generated artifacts
- [ ] Agents can create `feature/<id>-<slug>` branches from `develop`
- [ ] No commit lands directly on `main` as part of this ticket
