# Simplified GitFlow: develop integrates, main releases

This Starter is private, owner-plus-agents, and will be rough during 0.x. `develop` is the default integration branch with preview deploys; `main` only receives release PRs from `develop` and production deploys from SemVer tags. Feature branches never target `main`. Full GitFlow (`release/*`, `support/*`) is deferred until 1.0 has a cadence; GitHub Flow (main-only) cannot keep `main` stable while `develop` is allowed to move fast.
