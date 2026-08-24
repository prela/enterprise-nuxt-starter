# 02: Private GitHub remote

**What to build:** The owner has a private GitHub repository named `enterprise-nuxt-starter` connected as origin, with branch protection and a PR template, so agents can open PRs into `develop` and cannot push around GitFlow.

**Blocked by:** 01 Init git

**Status:** ready-for-agent

- [ ] Private GitHub repository `enterprise-nuxt-starter` exists (owner creates or connects the remote)
- [ ] `develop` and `main` are protected; agents cannot push directly to either
- [ ] PRs use a template that records what changed and how it was tested
- [ ] Agents do not push until the remote and protection exist
- [ ] No `release/*` branches are introduced
