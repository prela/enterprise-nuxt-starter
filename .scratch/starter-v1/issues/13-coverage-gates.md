# 13: Coverage gates

**What to build:** CI fails the PR when coverage is under 80% globally or under 95% on domain and application-service modules. Vue glue and generated types are not chased to 95%.

**Blocked by:** 12 CI on PRs to develop

**Status:** ready-for-agent

- [ ] Coverage is measured in CI on PRs to `develop`
- [ ] Gate fails below 80% global coverage
- [ ] Gate fails below 95% on domain and application-service modules
- [ ] Generated types, Vue glue, and Layer wiring are excluded from the 95% gate (not from existing honestly)
