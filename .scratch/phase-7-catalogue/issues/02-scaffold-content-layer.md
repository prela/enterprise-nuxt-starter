# 02: Scaffold Content Nuxt Layer (7.2)

**Parent:** `.scratch/phase-7-catalogue/spec.md`

**What to build:** A Product can `extends` `@starter/content` and get a `docs` collection schema. Markdown files stay in the Host; this Layer ships no proof articles. The Playground does not extend it yet.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

- [x] `@starter/content` is a Nuxt Layer with a documented Public Layer interface (`extends` plus `docs` collection schema)
- [x] The Layer owns the `docs` Zod schema; it does not ship markdown
- [x] No `blog` collection
- [x] Documented read path is Nuxt Content queries (collection, navigation, surroundings), not a wrapper composable
- [x] The Layer does not `extends` i18n, seo, Identity, or UI
- [x] Lockstep version matches the other Starter Layers (`0.0.z`, additive)
- [x] Deep imports of this Layer’s Tiers fail the existing Public Layer interface lint fence
- [x] Playground Host `extends` list is unchanged (no visitor-facing docs yet)
- [x] Lint, typecheck, and existing Identity tests stay green
