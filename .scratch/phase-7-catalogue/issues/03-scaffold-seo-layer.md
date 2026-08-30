# 03: Scaffold SEO Nuxt Layer (7.3)

**Parent:** `.scratch/phase-7-catalogue/spec.md`

**What to build:** A Product can `extends` `@starter/seo` and get robots, sitemap, and Open Graph defaults that use Core’s public site URL. There is no second origin env. The Playground does not extend it yet.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

- [x] `@starter/seo` is a Nuxt Layer with a documented Public Layer interface (`extends` plus SEO defaults)
- [x] Site origin comes from Core’s existing public site URL; no duplicate origin env
- [x] Defaults cover robots, sitemap, and Open Graph; a Host may `noindex` routes
- [x] The Layer does not `extends` i18n, content, Identity, or UI
- [x] Lockstep version matches the other Starter Layers (`0.0.z`, additive)
- [x] Deep imports of this Layer’s Tiers fail the existing Public Layer interface lint fence
- [x] Playground Host `extends` list is unchanged (no visitor-facing SEO suite yet)
- [x] Lint, typecheck, and existing Identity tests stay green
