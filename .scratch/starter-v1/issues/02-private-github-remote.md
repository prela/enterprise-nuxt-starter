# 02: Private GitHub remote

**What to build:** The owner has a private GitHub repository named `enterprise-nuxt-starter` connected as origin, with branch protection and a PR template, so agents can open PRs into `develop` and cannot push around GitFlow.

**Blocked by:** 01 Init git

**Status:** ready-for-human

- [x] Private GitHub repository `enterprise-nuxt-starter` exists (owner creates or connects the remote)
- [ ] `develop` and `main` are protected; agents cannot push directly to either
- [x] PRs use a template that records what changed and how it was tested
- [ ] Agents do not push until the remote and protection exist
- [x] No `release/*` branches are introduced

## Comments

- Origin is `git@github.com:prela/enterprise-nuxt-starter.git`. Default branch on GitHub is `develop`. `develop` and `main` are both on the remote. No `release/*` heads.
- Visibility is **private** (was public; changed during this work package).
- **Protection blocker:** while the repo was public, classic protection was on for `develop` and `main` (PR required, `enforce_admins`, no force-push, no delete). After switching to private, both classic protection and repository rulesets return 403: *Upgrade to GitHub Pro or make this repository public*. GitHub Free personal accounts do not enforce those rules on private repositories. Restoring enforcement needs GitHub Pro (or an org on Team/Enterprise), or making the repo public again — owner decision. Until then GitFlow is protocol-only: agents still open PRs into `develop` and do not push to `develop`/`main`.
- PR template lives at `.github/PULL_REQUEST_TEMPLATE.md` (summary + test plan + target branch). `feature/02-private-github-remote` is local only until protection can be enforced (or the owner waives that gate).
