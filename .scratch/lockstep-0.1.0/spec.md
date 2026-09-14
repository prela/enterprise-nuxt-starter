# Lockstep 0.1.0 Playground production

Status: ready-for-agent

## Problem Statement

Catalogue Layers are accepted on the Coolify Playground preview (ticket 04, 12 Sep). `develop` has i18n, content, seo, the Identity cookie-bag Public Layer interface, and the prerender env fix. Production is still tag `v0.0.0` on `main`: Identity slice only. Lockstep is still `0.0.0`. The Phase 7 spec asked for an additive `0.0.z` bump, but `develop` also broke Identity’s Public Layer interface, so `0.0.1` would be a lie. Coolify production must become the same Playground Host as the accepted preview without becoming a docs Product, without npm publish, and without `1.0.0`.

## Solution

Cut lockstep `0.1.0` on every Nuxt Layer, merge `develop` into `main`, and tag `v0.1.0` so Coolify production deploys that Playground Host. Stay `0.y.z`. Expand the existing deployed-origin smoke so `/ready` cannot go green while `/docs` is 404. Owner production QA is the 12 Sep visitor checks minus register (no Principal on production Identity). Two Work packages into `develop` (`7.6` smoke, then `7.7` versions and Bible), then a release PR, then the tag. No docs Product. No fonts, image, or scripts.

## User Stories

1. As the owner, I want Coolify production to serve the same Playground Host composition as the 12 Sep preview, so that production is not a frozen Identity-only museum.
2. As the owner, I want production matching to mean visitor-checkable Host behaviour, so that a green `/ready` cannot hide a `/docs` 404 the way 10 Sep did.
3. As a Playground visitor on production, I want `/` to stay the English Playground home (“This is a Playground, not a Product”), so that I do not treat Coolify as a Product.
4. As a Playground visitor on production, I want `/docs` 200 with “Playground proof” copy, so that Catalogue Layers are proved on the production origin.
5. As a Playground visitor on production, I want `/hr` to redirect to `/hr/docs`, so that the Identity-era home is not pretended to be a translated marketing page.
6. As a Playground visitor on production, I want `/hr/docs` to show Croatian fixture copy, so that a locale added by the Host is visible on production.
7. As a Playground visitor on production, I want the sitemap to list home and English and Croatian docs and not advertise `/login`, `/register`, or `/protected`, so that public production does not index Identity routes.
8. As a Playground visitor on production, I want `/login` to stay English and unprefixed, so that Identity URLs did not move under `/en`.
9. As a Playground visitor on production, I want anonymous `/protected` to redirect to `/login`, so that Identity still exists on the extend-all Host.
10. As the owner, I want production QA not to register a Principal, so that visitor proof does not write Identity data into the production database.
11. As the owner, I want the Identity click-path (register → log in → `/protected` → log out) to remain a preview fact, so that Session-cookie proof is not repeated on production.
12. As the owner, I want lockstep `0.1.0`, so that the Identity Public Layer interface break and the Catalogue Layers share one honest `0.Y` version.
13. As the owner, I do not want lockstep `0.0.1`, so that a patch number is not spent on a Y-class Public Layer interface change.
14. As the owner, I want to stay `0.y.z` and not tag `1.0.0`, so that Coolify Playground production does not start the 1.0.0 clock (ADR-0005).
15. As the owner, I want no npm publish, so that a production Product cannot depend on Layers yet.
16. As a future Product maintainer, I want every Nuxt Layer on the same lockstep version, so that I never resolve mixed Layer versions.
17. As a future Product maintainer, I want the tag to be `v0.1.0` matching that lockstep version, so that a work package ID cannot be mistaken for a release.
18. As an operator, I want production to deploy only from that tag on `main`’s tip, so that a merge to `main` does not ship (ADR-0004).
19. As an operator, I want Auto Deploy on the production Coolify application to stay off, so that `main` merges remain non-deploying.
20. As an agent, I want Work package `7.6` to expand deployed-origin smoke before any tag, so that preview and production fail closed on catalogue Host HTTP.
21. As CI, I want `pnpm smoke` against preview and production to assert `/docs` 200 and “Playground proof”, so that Coolify cannot ship a 28 Aug Identity-only image as green.
22. As CI, I want that smoke to assert `/hr` redirects to `/hr/docs`, so that the locale prefix is observed on the deployed origin.
23. As CI, I want that smoke to treat sitemap index plus locale sitemaps as the sitemap body (including home and docs, excluding Identity routes), so that a `/sitemap.xml` 307 is not a miss.
24. As CI, I want that smoke to assert `/login` is English and unprefixed, so that Identity did not move under a locale prefix on Coolify.
25. As CI, I want that smoke to assert anonymous `/protected` redirects to `/login`, so that Identity is present without creating a Principal.
26. As CI, I want existing `/health`, `/ready`, baseline headers, and CSP report-only smoke to stay, so that v1 production contract is not dropped.
27. As CI, I want preview smoke and production smoke to share one contract, so that the 10 Sep hole cannot exist on only one origin.
28. As an agent, I want TDD on that smoke contract, so that catalogue assertions exist as failing fixture-Host tests before the checker is wired.
29. As an agent, I want no Playwright against Coolify production, so that smoke stays Host HTTP and does not register a Principal.
30. As an agent, I want Host HTTP and Playwright in CI to stay the local proof they already are, so that `7.6` does not rebuild catalogue tests on a second seam.
31. As an agent, I want Work package `7.7` blocked on `7.6`, so that the tagged SHA already carries catalogue smoke.
32. As an agent, I want `7.7` to set every Nuxt Layer version to `0.1.0`, so that lockstep matches the tag.
33. As an agent, I want `7.7` to record Catalogue Layer in the glossary, so that i18n, content, and seo are not called a Product or a CMS.
34. As an agent, I want fonts, image, and scripts excluded from Catalogue Layer, so that this cut cannot grow extra Nuxt Layers.
35. As the owner, I want an approved Bible diff in `7.7`, so that policy describes six Nuxt Layers instead of three.
36. As the owner, I want that Bible diff to keep v1 WBS rows `0.1`–`6.2` and v1 non-goals, so that Identity-era history is not rewritten.
37. As the owner, I want the Bible WBS `7+` row to say Catalogue Layer proof `7.1`–`7.5` is done, so that agents do not treat i18n as unimplemented.
38. As the owner, I want Bible WBS rows `7.6` (depends on `7.4`) and `7.7` (depends on `7.5` and `7.6`), so that the two wrap-up Work packages have ids.
39. As an agent, I want the Bible vocabulary line to name Catalogue Layer, so that agents follow `CONTEXT.md` from policy too.
40. As an agent, I want the Bible tech stack to distinguish v1 Layers (Core, UI, Identity) from current Catalogue Layers (i18n, content, seo), so that image/fonts/scripts stay out.
41. As an agent, I want the Bible layout tree to list all six Nuxt Layer directories and say the Host `extends` all six, so that the tree matches the Playground.
42. As an agent, I want the Bible future-proof smoke line to include catalogue Host HTTP on deployed origins, so that policy matches `7.6`.
43. As an agent, I want README to stop saying “all three Nuxt Layers”, so that humans are not told production is Identity-only.
44. As an agent, I want the ticket 04 accept record on a feature branch in `7.7`, so that agents do not commit further on `develop`.
45. As an agent, I want one feature branch and one PR into `develop` per Work package, so that smoke and the version bump stay reviewable.
46. As an agent, I want branches `feature/7.6-deployed-catalogue-smoke` and `feature/7.7-lockstep-0.1.0`, so that GitFlow names match WBS ids.
47. As an agent, I want a release PR `develop` → `main` after `7.7`, so that feature branches never target `main`.
48. As CI, I want the `ci` check green on that release PR before merge, so that branch protection on `develop`/`main` is honoured.
49. As an operator, I want to tag the merge commit `v0.1.0` only when it is `main`’s tip, so that the Coolify webhook ships the tag.
50. As CI, I want production workflow lockstep to accept `v0.1.0` and reject `1.0.0` and work package ids, so that ADR-0005 stays mechanical.
51. As the owner, I want to visitor-check production after green smoke, so that Croatian fixture copy and surroundings are seen by a human, not only HTTP smoke.
52. As an agent, I want Conventional Commits, so that `7.6` is a `test`/`fix` of deployed proof and `7.7` records the `0.1.0` bump without implying `1.0.0`.
53. As a future Product maintainer, I want cookie-bag Identity to ride this release, so that production does not keep the pre-ADR-0010 port while preview already moved.
54. As the owner, I want this repository to remain a Starter plus Playground, so that production `/docs` is proof, not a docs Product (ADR-0012).
55. As the owner, I want no fonts, image, or scripts Nuxt Layers in this cut, so that chrome catalogue waits for a later Work package.
56. As an agent, I want not to edit the Bible outside the approved outline plus `7.6`/`7.7` WBS rows, so that Phase 8 and a Product are not smuggled in.
57. As CI, I want omit fixtures, Identity port tests, and coverage gates to stay green, so that the release does not relax Phase 7 quality.
58. As an agent, I want to use Playground, Host, Product, Nuxt Layer, Catalogue Layer, Identity, Principal, Session, Work package, and Bible as in `CONTEXT.md`, so that I do not call production a Product or `7.6` a SemVer tag.

## Implementation Decisions

- **Seam:** One existing deployed-origin Host HTTP smoke, shared by preview and production. Do not add a second checker, a Coolify API client, or Playwright against Coolify.
- **Smoke contract (additive):** Keep health, readiness, baseline headers, and CSP report-only. Add: `/docs` 200 with “Playground proof”; `/hr` redirect to `/hr/docs`; sitemap lists home and docs, not Identity routes; `/login` English and unprefixed; anonymous `/protected` redirects to `/login`. Follow sitemap index redirects; a 307 from `/sitemap.xml` is not failure.
- **Smoke does not:** Fetch Croatian fixture strings, click docs nav, register, log in, or create a Principal. Those stay owner QA (Croatian and nav) or preview Playwright (Identity click-path).
- **Versioning:** Lockstep `0.1.0` on Core, UI, Identity, i18n, content, and seo. Tag `v0.1.0`. Not `0.0.1`. Not `1.0.0`. No npm. Cookie-bag plus Catalogue Layers are one `0.Y` bump (ADR-0005, ADR-0010, ADR-0011).
- **GitFlow:** `7.6` then `7.7` into `develop`. Release PR `develop` → `main`. Tag on `main` tip deploys. Feature branches never target `main`. Agents never commit on `develop` or `main`. Ticket 04 accept commit moves onto `7.7`.
- **WBS:** `7.6` deployed catalogue smoke (depends on `7.4`). `7.7` lockstep `0.1.0` (depends on `7.5` and `7.6`). Not Phase 8.
- **Glossary:** Catalogue Layer is i18n, content, or seo. Fonts, image, and scripts are not Catalogue Layers.
- **Bible (owner-approved):** Vocabulary Catalogue Layer; tech stack v1 Layers vs current Catalogue Layers; layout tree six directories and Host `extends` all six; WBS `7+` says `7.1`–`7.5` done and still not image/fonts/scripts, npm, or a docs Product; add rows `7.6` and `7.7`; future-proof smoke mentions catalogue Host HTTP. Do not rewrite v1 rows `0.1`–`6.2` or v1 non-goals. Do not add a Product or Phase 8.
- **README:** Six Nuxt Layers, lockstep `0.1.0` example tag. Not “all three.”
- **Release after `7.7`:** Not a Work package into `develop`. PR `develop` → `main`, wait for `ci`, merge, tag `v0.1.0`.
- **Owner QA after tag:** Ticket 04 checks except register → log in → logout. No production Principal.
- **Persistence and Host:** Production topology unchanged (second Coolify application, same compose as preview, separate Postgres). Core still requires PostgreSQL. Omit fixtures stay CI-only.
- **Modules:** Do not add fonts, image, or scripts Layers. Do not start a docs Product. Do not change Identity, Catalogue Layer internals, or omit-fixture `extends` lists except as already on `develop`.

## Testing Decisions

- **Good tests** assert observable HTTP on a Host origin: status, Location, and body strings the visitor can see (“Playground proof”, English login). They do not assert Nuxt module option objects, sitemap generator internals, Coolify APIs, cookie bags, or Playwright against production.
- **Seam 1 — deployed-origin smoke (existing, extend):** Fixture HTTP Host in unit tests drives the shared smoke function. Red: catalogue paths missing or Identity routes advertised in the sitemap fail. Green: wire those checks into the same smoke used by preview and production workflows. Prior art: existing smoke fixture-Host tests (health, ready, headers, CSP, `PRODUCTION_URL` CLI). TDD for `7.6`.
- **Seam 2 — lockstep (existing, do not expand):** After `7.7`, every Nuxt Layer manifest is `0.1.0` and a matching `v0.1.0` tag is legal; `1.0.0` and work package ids stay illegal. Prior art: existing lockstep specs. No new versioning framework.
- **Not a seam:** Local Host HTTP and Playwright already prove catalogue and Identity in CI. Omit-fixture HTTP already proves take/omit. Owner browser QA on `PRODUCTION_URL` is not automated.
- **Gates:** Existing CI (lint, typecheck, unit, e2e, coverage 80% / 95%) stays green. Production and preview workflows keep calling the same smoke command.

## Out of Scope

- A docs Product, marketing encyclopedia, or second deployable Host.
- npm publish; independent per-Layer versions; `1.0.0`; `release/*` branches.
- Fonts, image, or scripts Nuxt Layers; `@nuxt/fonts`, `@nuxt/image`, `@nuxt/scripts`.
- Registering a Principal on production; Playwright against Coolify.
- Translating Identity; Identity depending on i18n; changing the cookie-bag port (already on `develop`).
- A `blog` collection; Bible/`CONTEXT.md`/ADR ingest into Content.
- Re-running Coolify production setup unless the existing production app is missing.
- Phase 8 WBS; editing the Bible beyond the approved outline plus `7.6`/`7.7` rows.

## Further Notes

- Glossary: `CONTEXT.md` (Catalogue Layer added during grilling). Policy: Bible Phase 7 WBS plus this spec’s `7.6`/`7.7`. Decisions: ADR-0004, ADR-0005, ADR-0007, ADR-0010, ADR-0011, ADR-0012.
- Work package ids are branch names, not SemVer tags. `v0.0.0` already points at current `main`; a new production SHA requires a new lockstep version.
- `develop` already contains cookie-bag, Catalogue Layers, omit fixtures, and the prerender env fix. This spec does not re-implement Phase 7 `7.1`–`7.5`.
- Ticket 04 accept (12 Sep) explicitly did not bump, merge to `main`, or change smoke; this spec is that follow-up.
