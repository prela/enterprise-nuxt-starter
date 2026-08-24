# 02: Private GitHub remote

**What to build:** The owner has a private GitHub repository named `enterprise-nuxt-starter` connected as origin, with branch protection and a PR template, so agents can open PRs into `develop` and cannot push around GitFlow.

**Blocked by:** 01 Init git

**Status:** ready-for-agent

- [x] GitHub repository `enterprise-nuxt-starter` exists as origin (owner chose **public** so Free-plan branch protection can enforce)
- [x] `develop` and `main` are protected; agents cannot push directly to either
- [x] PRs use a template that records what changed and how it was tested
- [x] Agents do not push until the remote and protection exist
- [x] No `release/*` branches are introduced

## Comments

- Origin is `git@github.com:prela/enterprise-nuxt-starter.git`. Default branch on GitHub is `develop`. `develop` and `main` are both on the remote. No `release/*` heads.
- **Owner decision:** keep the repo **public** so GitHub Free can enforce branch protection. Private + protection needs GitHub Pro (or an org on Team/Enterprise). Bible/spec still say private; this ticket records the override, it does not edit `project.md`.
- Protection on `develop` and `main`: pull request required (`required_approving_review_count` 0 so a solo owner can merge), `enforce_admins`, no force-push, no delete.
- PR template lives at `.github/PULL_REQUEST_TEMPLATE.md` (summary + test plan + target branch).
