# 13: Coverage gates

**What to build:** CI fails the PR when coverage is under 80% globally or under 95% on domain and application-service modules. Vue glue and generated types are not chased to 95%.

**Blocked by:** 12 CI on PRs to develop

**Status:** resolved

- [x] Coverage is measured in CI on PRs to `develop`
- [x] Gate fails below 80% global coverage
- [x] Gate fails below 95% on domain and application-service modules
- [x] Generated types, Vue glue, and Layer wiring are excluded from the 95% gate (not from existing honestly)

## Comments

- `pnpm test` is `vitest run --coverage`. CI already runs that script on PRs to `develop`, so the gate is not advisory.
- Global 80% applies to measured Starter TypeScript (`layers/**/*.ts`, `app/**/*.ts`). Vue SFCs are omitted because v8 cannot parse them; Host HTTP/Playwright remain the UI seam.
- Layer wiring (`nuxt.config.ts`, `drizzle.config.ts`) and Nitro/adapters (`infrastructure/`, `server/`) are excluded from the 95% globs. Port re-exports and app config still appear in the 80% report.
- Domain and application-service modules (`layers/**/domain/**`, `layers/**/application/**`) have a 95% glob threshold on statements, branches, functions, and lines.

## Answer

CI fails the PR when Vitest coverage is under 80% on the measured TypeScript pool or under 95% on Identity domain and application-service modules. Vue glue, generated types, and Layer wiring are not held to 95%.
