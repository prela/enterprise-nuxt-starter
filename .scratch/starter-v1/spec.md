# Starter v1

Status: ready-for-agent

## Problem Statement

The owner needs a production-ready Nuxt 4 Starter that later Products (PMS, rental, marketing site) can extend without a one-way fork. Today the repository is a stock Nuxt app: no git, no Nuxt Layers, no Identity, no tests, no deploy path. The Bible lists a large catalogue, but v1 must be a thin vertical slice that is actually deployed — not a kitchen-sink template and not a Product domain in this repo.

## Solution

Ship Starter v1 as three optional-to-a-Product Nuxt Layers (`core`, `ui`, `identity`) plus a Playground Host at the repository root that extends them. A visitor can register, log in, see one protected page, and log out. Identity is a port; Better Auth on PostgreSQL via Drizzle is the first adapter. Work proceeds as work packages on simplified GitFlow, with CI on `develop` and production from a SemVer tag on `main` (Coolify). Tests run at two seams only: the Identity port, and the Host HTTP/UI.

## User Stories

1. As the owner, I want a Starter that Products can `extends` and upgrade, so that PMS or a marketing site does not start from a dead clone.
2. As the owner, I want this repository to stay a Starter and Playground only, so that Product domains never leak into the foundation.
3. As the owner, I want the Bible to change only after I approve a proposed diff, so that agents cannot silently rewrite policy.
4. As an agent, I want a glossary of Starter, Product, Playground, Host, Nuxt Layer, Tier, Identity, and Public Layer interface, so that I do not call a Product a “service” or a Tier a “layer.”
5. As an agent, I want hard-to-reverse decisions recorded as ADRs, so that I do not re-litigate Better Auth vs Clerk in a later work package.
6. As the owner, I want TypeScript only and strict checking, so that JavaScript does not enter the Starter.
7. As an agent, I want one work package per feature branch and PR into `develop`, so that Nuxt Layers do not land in one entangled diff.
8. As an agent, I want to claim a work package only when its dependencies are merged, so that I do not build Identity presentation before the port exists.
9. As an agent, I want TDD (red first) on Identity work packages and Playground E2E, so that the slice is specified by tests before adapters appear.
10. As an agent, I want to stop and write on the ticket when blocked, so that I do not “just start” the next work package.
11. As the owner, I want `develop` as the default integration branch, so that `main` stays releasable while 0.x is rough.
12. As an agent, I want never to commit directly to `develop` or `main`, so that every change is reviewable.
13. As the owner, I want `hotfix/*` from `main` merged back to `develop`, so that production fixes are not lost.
14. As the owner, I want no `release/*` branches in v1, so that GitFlow stays small until 1.0 has a cadence.
15. As the owner, I want lockstep SemVer for all Nuxt Layers, so that a Product does not resolve `@starter/core@1` against `@starter/identity@3`.
16. As the owner, I want the Starter to remain `0.y.z` until a production Product depends on it, so that public-interface breaks stay honest and cheap.
17. As an agent, I want work package IDs (`0.1`, `1.1`, `3.3`) to label tickets and branches only, so that I do not tag `git init` as a release.
18. As an agent, I want Conventional Commits, so that the changelog can be produced mechanically.
19. As the owner, I want a private GitHub repository named `enterprise-nuxt-starter`, so that Actions and Coolify have a remote.
20. As the owner, I want to create or connect that remote myself, so that agents do not push before branch protection exists.
21. As the owner, I want branch protection on `develop` and `main`, so that the GitFlow cannot be bypassed.
22. As an agent, I want a PR template, so that every work package records what changed and how it was tested.
23. As an agent, I want root scripts for lint, typecheck, and test, so that CI and local runs share one interface.
24. As the owner, I want lint and typecheck at zero errors, so that the Starter never ships a red toolchain.
25. As a future Product maintainer, I want the Host at the repository root with Nuxt Layers beside it, so that I can copy the same `extends` shape in a Product repo.
26. As a future Product maintainer, I want each Nuxt Layer to have its own package manifest, so that Layers can be published later without a layout rewrite.
27. As a future Product maintainer, I want to take or omit the Identity Nuxt Layer, so that a marketing Product is not forced to register users.
28. As a future Product maintainer, I want a documented Public Layer interface per Nuxt Layer, so that I know what I am allowed to import.
29. As a future Product maintainer, I want deep imports of another Layer’s Tiers to fail CI, so that Drizzle tables cannot become the de facto interface.
30. As an agent, I want Tiers inside a Layer to import freely within that Layer, so that enforcement does not police internal structure.
31. As an agent, I want the Core Nuxt Layer to own shared Nuxt defaults, composition utilities, and runtime-config validation, so that UI and Identity do not each invent env parsing.
32. As an operator, I want required environment variables rejected at startup with a clear Zod failure, so that a misconfigured Coolify deploy does not boot half-alive.
33. As an operator, I want a health endpoint that is not cached, so that an orchestrator never sees a stale “ok.”
34. As an operator, I want a readiness endpoint that is not cached, so that traffic is not sent before PostgreSQL and Identity’s adapter are ready.
35. As an operator, I want baseline security headers and CSP in report-only first, so that the Playground can go live without immediately breaking scripts.
36. As the owner, I want CSRF protection on Identity-changing requests, so that a third-party site cannot log someone out or register on their behalf.
37. As a Playground visitor, I want a mobile-first layout with dark and light mode, so that the few v1 screens are usable on a phone.
38. As a Playground visitor, I want v1 screens to meet WCAG 2.2 AA, so that I can complete register and login with assistive technology.
39. As an agent, I want Nuxt UI for v1 controls, and shadcn-vue only when Nuxt UI has no control, so that the UI Layer does not grow a second design system.
40. As an agent, I want atomic design only as far as register/login/protected/error screens need, so that v1 does not become a component encyclopedia.
41. As an agent, I want default, auth, and error layouts in the UI Layer, so that Identity presentation does not own chrome.
42. As a Playground visitor, I want a home page that explains this is a Playground, so that I do not mistake it for a Product.
43. As a Playground visitor, I want to register with email and password, so that I can become a member without a hosted identity vendor.
44. As a Playground visitor, I want validation errors when email is invalid or password is too weak, so that I can correct the form without a generic failure.
45. As a Playground visitor, I want registration to fail clearly if the email is already used, so that I am not told it succeeded.
46. As a Playground member, I want to log in with email and password, so that I can reach the protected page.
47. As a Playground visitor, I want login to fail without revealing whether the email exists, so that accounts cannot be enumerated cheaply.
48. As a Playground member, I want an httpOnly session cookie, so that JavaScript on the page cannot steal the session.
49. As a Playground member, I want to stay logged in across SSR navigations, so that the protected page does not bounce me to login after a refresh.
50. As a Playground visitor, I want visiting the protected page to send me to login, so that I never see member-only content.
51. As a Playground member, I want to open the protected page after login, so that I can see that Identity is working.
52. As a Playground member, I want to log out and then be treated as a visitor, so that a shared browser is safe.
53. As a Playground member, I want logout to invalidate the server session, so that the cookie cannot be replayed.
54. As an agent, I want Identity application services to speak only to a port, so that Better Auth can be replaced without rewriting stories 43–53.
55. As an agent, I want an in-memory fake adapter for that port, so that work package 3.1 can go red-green before Drizzle exists.
56. As an agent, I want Better Auth as the first production adapter, self-hosted on our PostgreSQL, so that credentials are not stored at Clerk, Auth0, or Supabase Auth.
57. As an agent, I want user and session persisted via Drizzle migrations, so that a fresh Compose stack can boot the schema.
58. As a future Product maintainer, I want Identity persistence to live in the Identity Nuxt Layer, so that omitting Identity omits those tables.
59. As an agent, I want Pinia stores to stay thin, so that login rules live in application services, not in client state.
60. As a Playground visitor, I want Identity pages to be SSR, so that the first paint is a real form, not an empty shell.
61. As an agent, I want Docker Compose to run the Playground and PostgreSQL together, so that E2E and humans share one local topology.
62. As CI, I want lint, typecheck, unit tests (Identity port), and Playwright E2E on every PR to `develop`, so that a red slice cannot merge.
63. As the owner, I want 80% coverage globally and 95% on domain and application-service modules, so that Vue glue is not chased to 95%.
64. As CI, I want coverage gates to fail the PR when those thresholds are missed, so that the gate is not advisory.
65. As the owner, I want a Coolify preview of the Playground from `develop`, so that I can click the slice before a release.
66. As the owner, I want production deploy of the Playground from a SemVer tag on `main`, so that production is an intentional release.
67. As an operator, I want smoke checks on preview and production for health, headers, and CSP report-only, so that a deploy that boots but is unsafe is visible.
68. As a future Product maintainer, I want hybrid route rules available in Core for later page types, so that v1 Identity SSR does not paint us into CSR-only.
69. As the owner, I want v1 to exclude i18n, Nuxt Content, a full SEO suite, and an image/fonts programme, so that the slice can finish.
70. As an agent, I want work package 7+ left untouched, so that a “helpful” i18n PR cannot claim to be v1.

## Implementation Decisions

- **Modules (Nuxt Layers + Host):** Build `core`, `ui`, and `identity` as Nuxt Layers. The Playground is the Host at the repository root and extends all three. No other Nuxt Layer in v1.
- **Public Layer interface:** Each Layer exports documented entrypoints only. The Host and future Products import those entrypoints. Deep imports of another Layer’s Tiers fail CI (ESLint). Tiers may import within their own Layer. ADR-0008.
- **Tiers:** Inside a Layer, code is presentation, application, domain, or infrastructure. Application and domain depend on ports, not on Drizzle or Better Auth.
- **Identity port (seam 1):** The Identity Public Layer interface is the port: register; authenticate; end session; current principal; may-access-route (or equivalent authorization check used by route middleware). Error modes: validation failure, duplicate email, invalid credentials (non-enumerating), unauthenticated, forbidden. This is the only behavioral seam inside the Layers.
- **Identity adapters:** Two adapters at that port: an in-memory fake (tests and work package 3.1) and Better Auth (production). Hosted IdPs are not adapters in v1. OAuth is not an adapter in v1. ADR-0002, ADR-0006.
- **Session:** httpOnly cookie session owned by the Starter. Not JWT-in-localStorage. SSR must see the same principal as the client after refresh.
- **Persistence:** PostgreSQL via Drizzle. Identity owns user and session schema and migrations. No MySQL. No generic database port (only one engine). ADR-0003.
- **Core:** Strict TypeScript Nuxt defaults, Antfu ESLint, Zod runtime-config/env schema, health and readiness (no-cache), `nuxt-security` with CSP report-only then a path to enforce, baseline headers, CSRF on state-changing Identity routes.
- **UI:** Nuxt UI + Tailwind, color mode, mobile-first. Layouts: default, auth, error. Components only as required by register, login, logout, protected, home, and error. shadcn-vue only if Nuxt UI lacks a control.
- **Host:** Pages for home, register, login, protected, and logout (or logout as an action). Protected route uses Identity middleware. Identity pages SSR. Thin Pinia only if needed for presentation; no business rules in stores.
- **HTTP contracts:** Health and readiness return success only when the process (and readiness: persistence/adapter) is actually ready; `Cache-Control` must forbid caching. Identity HTTP follows the port’s error modes; login failure does not disclose whether the email exists.
- **Env:** Required secrets and database URL validated with Zod at startup; boot fails closed.
- **Git:** Simplified GitFlow. Default branch `develop`. Feature branches `feature/<work-package-id>-<slug>`. Release PR `develop` → `main`. Production from SemVer tag on `main`. Hotfix from `main` into `main` and `develop`. ADR-0004.
- **Versioning:** One version for all Layers. `0.y.z` until a production Product depends on the Starter; then `1.0.0`. Work package IDs are not tags. Conventional Commits. ADR-0005.
- **Remote:** Private GitHub `enterprise-nuxt-starter`. Owner connects remote and protection before agents push. PR template required.
- **Compose:** Playground + PostgreSQL for local and E2E.
- **CI:** On PRs to `develop`: lint, typecheck, unit (Identity port + any Core behavior tested via Host HTTP where applicable), Playwright E2E, coverage gates 80% global / 95% domain and application-service modules.
- **Deploy:** Coolify preview from `develop`; production from tag on `main`; smoke health/headers/CSP.
- **Distribution shape:** Starter is published Nuxt Layers, not a clone-once template and not a monorepo of Products. ADR-0001, ADR-0007.
- **WBS:** Execute work packages `0.1`–`6.2` as in the Bible. Do not merge a work package that crosses Layer boundaries except the Host `extends` work package (`4.1`).
- **Bible:** Agents must not edit `project.md` without owner approval.

## Testing Decisions

- **Good tests** assert observable behavior at a seam: they do not assert Drizzle schema shape, Better Auth function names, Vue component internals, or file layout. If a test would break when swapping the Better Auth adapter for another adapter that still satisfies the Identity port, it is testing the wrong seam.
- **Seam 1 — Identity port:** Unit/application-service tests against the in-memory fake: register (happy, invalid email, weak password, duplicate email); authenticate (happy, wrong password, unknown email without enumeration); session principal after authenticate; end session (cannot use principal afterward); may-access-route / middleware decision for anonymous vs authenticated. Coverage target 95% on these application-service/domain modules.
- **Seam 2 — Host HTTP/UI:** Playwright: visitor sees home; registers; is redirected or can log in; anonymous GET/visit to protected page goes to login; member sees protected page; logout returns visitor behavior; cookie is httpOnly (where the test can observe Set-Cookie flags). HTTP: health 200 and no-cache; readiness 200 (or 503 when DB down) and no-cache; security headers present; CSP report-only in v1. Host refuses to start or readiness fails on missing required env (assert via HTTP/startup, not by importing Zod schemas as the primary test).
- **Not tested as seams:** UI atoms, repositories, Better Auth internals, ESLint rule implementation details (the fence failing CI on a deliberate deep import can be one lint fixture, not a product suite).
- **Prior art:** None. The repository has no test suite today. Do not copy Nuxt welcome-page patterns as test style.
- **TDD:** Work packages 3.1–3.4 and 4.4 write failing tests at the relevant seam before implementation. 3.1 must pass on the fake with no Better Auth.
- **Gates:** CI fails on lint errors, typecheck errors, failing tests, or coverage below 80% global / 95% on domain and application-service modules.

## Out of Scope

- Any real Product (PMS, rental, marketing site) in this repository.
- i18n; Nuxt Content; full SEO suite (Open Graph programme, sitemap as a product); `@nuxt/image` / `@nuxt/fonts` / `@nuxt/scripts` as a programme.
- Atomic-design encyclopedia; extra layouts (admin, etc.) beyond default, auth, and error.
- Independent per-Layer versions; CalVer; `release/*` branches.
- OAuth, magic links, password reset, email verification, 2FA, Clerk, Auth0, Supabase Auth, nuxt-auth-utils, hand-rolled JWT.
- MySQL; Prisma; a generic database port; swapping PostgreSQL in v1.
- Publishing Nuxt Layers to npm; a second Host app; pnpm `apps/playground` workspace layout.
- Enforcing CSP (report-only only in v1); full observability platform (structured logs and error boundaries may exist at a minimum; no APM requirement).
- Work package 7+ catalogue items.
- Editing the Bible without owner approval.

## Further Notes

- Glossary: `CONTEXT.md`. Policy: Bible. Decisions: ADRs 0001–0008. WBS IDs in the Bible are the branch names for `/to-tickets` if tickets are generated later.
- Identity is optional for a future Product: the Playground includes it to prove the slice; omitting it is a Product choice, not a v1 Playground choice.
- CSP starts report-only so Nuxt UI and Better Auth scripts can be observed before enforce. Do not “fix” report-only to enforce inside v1 unless a later approved Bible change says so.
- The two test seams are the entire agreed test architecture. Do not add a Core-env module seam or component-level seam without a new spec.
