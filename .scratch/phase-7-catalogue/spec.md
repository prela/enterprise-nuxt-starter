# Phase 7 catalogue Layers

Status: ready-for-agent

## Problem Statement

Starter v1 is shipped (Identity slice on Coolify preview and production, lockstep 0.0.0). A future marketing/docs Product for the Starter itself will need i18n, Nuxt Content, and an SEO suite that it can `extends` — and it must omit Identity. This repository has none of those as Nuxt Layers. The Playground cannot pretend to be that Product, Layers are not published to npm, and dumping i18n or SEO into Core would make omit impossible.

## Solution

Phase 7 proves three omit-able Nuxt Layers — i18n, content, and seo — on this Starter only. The Playground Host extends every shipped Layer and carries a thin `docs` proof collection (English plus a Croatian fixture). Git remains the agent canon; the guide encyclopedia is the future Product. Stay lockstep `0.0.z`. No npm publish. No Product in this repo. CI omit fixtures prove a docs-shaped Host (no Identity) and a PMS-shaped Host (no catalogue Layers).

## User Stories

1. As the owner, I want phase 7 to prove catalogue Nuxt Layers on this Starter, so that a future docs Product can `extends` them instead of forking.
2. As the owner, I want this repository to remain a Starter plus Playground, so that a marketing/docs Product is not smuggled into the Host.
3. As the owner, I want the future first Product to be a marketing/docs site for the Starter (guides for users and agents), so that demand for Content, SEO, and i18n is real rather than catalogue completeness.
4. As a future Product maintainer, I want that docs Product to `extends` Core, UI, Content, SEO, and i18n and omit Identity, so that a public docs site is not forced to register users.
5. As a future Product maintainer, I want a PMS-shaped Product to `extends` Core, UI, and Identity and omit Content, SEO, and i18n, so that an admin app does not take a CMS.
6. As an agent, I want to use Playground, Product, Host, Nuxt Layer, Omit fixture, and Public Layer interface as in `CONTEXT.md`, so that I do not call the Playground a docs site or an omit fixture a second Playground.
7. As an agent, I want ADR-0011 and ADR-0012 to constrain phase 7, so that I do not dump i18n into Core or turn Coolify into the docs Product.
8. As the owner, I want lockstep `0.y.z` until a production Product depends on published Layers, so that Coolify Playground production does not trigger `1.0.0`.
9. As the owner, I want new Nuxt Layers in 0.x to bump `0.0.z`, so that `0.Y` remains a break of an existing Public Layer interface.
10. As the owner, I want no npm publish in phase 7, so that a production docs Product cannot depend yet and accidentally start the 1.0.0 clock.
11. As a future Product maintainer, I want every new Layer to share the Starter lockstep version, so that I never resolve mixed Layer versions.
12. As an agent, I want work packages `7.1`, `7.2`, and `7.3` to be parallel after v1, so that i18n, Content, and SEO do not wait on each other.
13. As an agent, I want `7.4` blocked on `7.1`–`7.3`, so that the Host `extends` composition is one PR.
14. As an agent, I want `7.5` blocked on `7.4`, so that omit fixtures boot against documented Public Layer interfaces.
15. As an agent, I want one work package per feature branch and PR into `develop`, so that three Layers do not land in one entangled diff.
16. As an agent, I want never to cross Nuxt Layer boundaries in one PR except the Host `extends` work package (`7.4`), so that Layer internals stay reviewable.
17. As an agent, I want Conventional Commits, so that an additive Layer is `feat` and a public-interface break is explicit.
18. As a future Product maintainer, I want i18n as `@starter/i18n`, so that an English-only Product can omit it.
19. As a future Product maintainer, I want Content as `@starter/content`, so that a PMS can omit a CMS.
20. As a future Product maintainer, I want SEO as `@starter/seo`, so that a private app can omit the suite.
21. As a future Product maintainer, I want Core to keep requiring PostgreSQL, so that phase 7 does not silently reopen `/ready` and `NUXT_DATABASE_URL`.
22. As a future Product maintainer, I want fonts and image to remain UI switches later, so that I do not take extra Nuxt Layers for chrome.
23. As the owner, I want `@nuxt/scripts` out of phase 7, so that third-party tags wait for a Product that has them.
24. As an agent, I want the three catalogue Layers not to `extends` each other, so that taking SEO does not force i18n.
25. As an agent, I want the Host to compose Core, UI, Identity, i18n, content, and seo, so that hreflang is composition, not a package dependency.
26. As a future Product maintainer, I want `@starter/i18n` to default to English and `prefix_except_default`, so that unprefixed URLs stay the default locale.
27. As a future Product maintainer, I want to add locales in the Host (for example Croatian `hr`), so that the Layer does not hard-code every market language.
28. As an agent, I want Identity not to depend on i18n, so that a Product can take Identity and omit i18n.
29. As a Playground visitor, I want register, login, logout, and the protected page to stay English, so that the first i18n work does not become an Identity copy seam.
30. As a Playground visitor, I want `/login`, `/register`, and `/protected` to stay unprefixed, so that Identity URLs do not move under `/en`.
31. As a Playground visitor, I want chrome titles to stay English, so that default-layout copy is not a phase-7 translation programme.
32. As a future Product maintainer, I want `@starter/content` to own the `docs` collection schema, so that every Host that takes Content shares one collection contract.
33. As a future Product maintainer, I want markdown files to live in the Host, so that extending Content does not ship Playground proof articles into my Product.
34. As the owner, I want no Bible, `CONTEXT.md`, or ADR ingest into Content, so that git remains the agent canon.
35. As the owner, I want proof copy to say it is Playground proof, not the Product, so that visitors do not treat Coolify as the Starter handbook.
36. As a Playground visitor, I want three English `docs` pages, so that navigation and surroundings are real, not a single stub.
37. As a Playground visitor, I want a Croatian sibling file per English doc (suffix convention), so that `/hr/docs` is not an empty locale.
38. As the owner, I want no `blog` collection in phase 7, so that a second schema is not built for a Product that does not exist.
39. As an agent, I want Nuxt Content query APIs (`queryCollection`, navigation, surroundings) to be the documented read path, so that we do not wrap them in a `useDocs` Public Layer interface until a Product needs it.
40. As a future Product maintainer, I want `@starter/seo` to consume Core’s public site URL, so that I do not set a second origin env.
41. As a future Product maintainer, I want SEO defaults for robots, sitemap, and Open Graph, so that taking the Layer is enough for a public docs origin.
42. As a Playground visitor, I want a sitemap that lists home and English and Croatian docs, so that the future Product’s SEO shape is proved.
43. As the owner, I want `/login`, `/register`, and `/protected` excluded from the sitemap and `noindex`ed, so that the public Playground does not advertise Identity URLs.
44. As a Playground visitor, I want Open Graph on at least one docs page, so that SEO is not “module wired, nothing asserted.”
45. As a Playground visitor, I want `/docs/**` prerendered and Identity routes SSR, so that hybrid rendering exists as soon as there is more than one kind of page.
46. As a Playground visitor, I want `/hr` to redirect to `/hr/docs`, so that the Identity-era home is not pretended to be a translated marketing page.
47. As a Playground visitor, I want `/` to stay the English Playground home, so that the Host still explains it is not a Product.
48. As a Playground visitor, I want to open `/docs`, follow nav to another doc, and see surroundings links, so that Content is proved in the browser.
49. As a Playground visitor, I want `/hr/docs` to show Croatian fixture copy, so that a Product can see how to add a locale.
50. As a Playground visitor, I want the Identity slice (register, log in, protected, log out) to keep working, so that catalogue Layers do not break v1.
51. As CI, I want Host HTTP assertions for docs HTML, locale prefix, `/hr` redirect, and sitemap body, so that Coolify is not the only place anyone looked.
52. As CI, I want Playwright to cover docs navigation, Croatian fixture text, English login, and the existing Identity cookie flow, so that the visitor path is one seam.
53. As a future Product maintainer, I want an omit fixture that `extends` Core, UI, Content, SEO, and i18n and omits Identity, so that “omit Identity” is not a README lie.
54. As a future Product maintainer, I want that docs-shaped fixture to boot and serve `/` without Identity routes, so that a marketing Host does not grow `/login` by accident.
55. As a future Product maintainer, I want an omit fixture that `extends` Core, UI, and Identity and omits Content, SEO, and i18n, so that a PMS Host does not grow `/docs` by accident.
56. As a future Product maintainer, I want that PMS-shaped fixture to boot and serve `/login` without `/docs`, so that catalogue Layers are truly omit-able.
57. As the owner, I want omit fixtures booted in CI and never deployed, so that ADR-0007 (one Host at repo root) still holds.
58. As an operator, I want omit fixtures to still satisfy Core’s PostgreSQL boot contract, so that “omit Identity” does not mean “omit the database.”
59. As a future Product maintainer, I want a documented Public Layer interface per new Layer (`extends`, defaults, what the Host may add), so that I know the legal surface.
60. As CI, I want deep imports of i18n, content, and seo Tiers to fail lint the same way Core, UI, and Identity already fail, so that Drizzle-style leaks do not become the Content interface.
61. As an agent, I want TDD at the Host HTTP/UI seam for `7.4` and at the omit-fixture HTTP seam for `7.5`, so that proof is specified before wiring.
62. As an agent, I want `7.1`–`7.3` to land packages and Public Layer interface docs without Playground pages, so that Layer PRs do not smuggle Host copy.
63. As CI, I want existing Identity port tests and coverage gates (80% / 95%) to stay green, so that phase 7 does not relax v1 quality.
64. As the owner, I want preview and production Playground deploys to keep working after `7.4`, so that Coolify does not become a Content-only breakage.
65. As an agent, I want not to edit the Bible without a new owner-approved diff, so that phase 7 policy stays the approved WBS.

## Implementation Decisions

- **Modules:** Add three Nuxt Layers — i18n, content, seo — each with its own package manifest at the Starter lockstep version. Do not put these capabilities in Core or UI. Do not add fonts, image, or scripts Layers.
- **Composition:** Catalogue Layers do not `extends` each other. After `7.4`, the Playground Host extends Core, UI, Identity, i18n, content, and seo. Omit fixtures extend subsets only.
- **i18n Public Layer interface:** `extends` plus documented defaults: default locale English, `prefix_except_default`, locales starting at English. The Playground Host adds `hr`. No Identity message catalogues. No vue-i18n deep imports. No wrapper composable.
- **Content Public Layer interface:** `extends` plus a `docs` collection schema (Zod). Host-owned markdown only. Document Nuxt Content queries (collection, navigation, surroundings) as the read path. No markdown inside the Layer. No `blog` collection. No wrappers.
- **SEO Public Layer interface:** `extends` plus Nuxt SEO defaults (robots, sitemap, Open Graph). Site origin is Core’s existing public site URL. Host may `noindex` Identity routes. No second origin env. No wrapper composable.
- **Playground proof:** One `docs` collection; three English pages and three `hr` suffix siblings; copy states this is Playground proof, not the Product. `/hr` redirects to `/hr/docs`. Unprefixed `/` remains the English Playground home.
- **Rendering:** Route rules prerender `/docs/**` (and the localized docs prefix). Identity routes stay SSR. No `/blog` rules.
- **SEO behaviour on the extend-all Host:** Sitemap includes home and English/Croatian docs; excludes Identity routes; Identity routes are `noindex`. OG asserted on at least one docs page.
- **Versioning:** Additive `0.0.z`. Stay `0.y.z` until a production Product depends on the Starter. No npm publish. ADR-0005, ADR-0011, ADR-0012.
- **Persistence:** Core still requires PostgreSQL. Identity still owns user/session. Content is file-based and does not add a database.
- **WBS:** Execute Bible Phase 7: `7.1` i18n, `7.2` content, `7.3` seo, `7.4` Host composition and proof, `7.5` omit fixtures. Do not implement later catalogue (fonts, image, scripts, publish, docs Product, Identity copy, Core without Postgres).
- **Git:** Same simplified GitFlow as v1. Branch names `feature/7.x-<slug>`.
- **Bible:** Already updated for phase 7; agents must not edit it again without owner approval.

## Testing Decisions

- **Good tests** assert observable Host behaviour: HTML, redirects, sitemap XML, locale prefix, Identity cookie flow, and whether a fixture Host boots with a given `extends` list. They do not assert vue-i18n internals, Content parser internals, Nuxt SEO module option objects, Vue component internals, or file layout of Layers.
- **Seam 1 — Host HTTP/UI (existing):** Same seam as v1. `@nuxt/test-utils` HTTP `fetch` for `/docs`, `/hr/docs`, `/hr` redirect, sitemap body (includes docs locales; excludes Identity paths), `noindex`/robots where observable, and Playground home still naming Playground. Playwright at the visitor UI: docs nav and surroundings, Croatian fixture string, `/login` still English, existing Identity register→login→protected→logout still green. Prior art: Host HTTP specs and the Identity-slice Playwright test.
- **Seam 2 — Omit fixture HTTP (new Host, same tool):** Two CI-only Hosts booted with `@nuxt/test-utils`, never deployed. Docs-shaped: Core+UI+content+seo+i18n, no Identity — boot, `/` 200, Identity routes absent. PMS-shaped: Core+UI+Identity, no content/seo/i18n — boot, `/login` 200, `/docs` absent. Both still satisfy Core’s database boot contract. This is the only new seam; omit cannot be observed on the extend-all Playground.
- **Not a new seam:** Identity port (leave existing tests). Public Layer interface fence stays a lint fixture: add deliberate deep-import cases for the three new Layers next to the existing Core/UI/Identity cases; do not build a second fence framework.
- **TDD:** `7.4` writes failing Host HTTP/UI tests before Playground pages and `extends`. `7.5` writes failing fixture-boot tests before fixture configs. `7.1`–`7.3` do not add Playground behavioural tests (Host is not extended yet).
- **Gates:** Existing CI (lint, typecheck, unit, e2e, coverage 80% / 95%) must stay green. Sitemap/docs assertions run in CI, not only on Coolify.

## Out of Scope

- Building the marketing/docs Product (guides encyclopedia) in this repository or as a published consumer.
- Publishing Nuxt Layers to npm; independent per-Layer versions; `1.0.0`; `release/*` branches.
- `@nuxt/fonts`, `@nuxt/image`, `@nuxt/scripts`; a fonts or image Nuxt Layer.
- Translating Identity screens or chrome; Identity depending on i18n.
- Making Core’s database URL optional; a no-PostgreSQL Host.
- A `blog` collection; ingesting Bible / `CONTEXT.md` / ADRs into Content; a second deployable Host; `apps/playground`.
- Wrappers (`useDocs`, custom i18n helpers) beyond documented `extends` and Nuxt module APIs.
- Changing the Identity port, Better Auth adapter, or v1 Identity E2E contract except that it must remain green.
- Editing the Bible without a new owner-approved diff.

## Further Notes

- Glossary: `CONTEXT.md` (including Omit fixture). Policy: Bible Phase 7 WBS. Decisions: ADR-0001, 0005, 0007, 0008, 0011, 0012.
- Work package IDs (`7.1`–`7.5`) are branch names for `/to-tickets`, not SemVer tags.
- The Playground is extend-all so Layers compose (CSP, cookies, prerender, Identity). Omit is fixture CI, not a second Coolify app.
- v1 spec stories that excluded i18n/Content/SEO as v1 non-goals remain true for v1; this spec is the post-v1 phase that implements the proof-only slice of that catalogue.
