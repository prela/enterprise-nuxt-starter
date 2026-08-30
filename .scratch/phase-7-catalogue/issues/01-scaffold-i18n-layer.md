# 01: Scaffold i18n Nuxt Layer (7.1)

**Parent:** `.scratch/phase-7-catalogue/spec.md`

**What to build:** A Product can `extends` `@starter/i18n` and get English as the default locale with unprefixed default URLs (`prefix_except_default`). The Host may add further locales (for example Croatian). Identity does not depend on this Layer. The Playground does not extend it yet.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

- [x] `@starter/i18n` is a Nuxt Layer with a documented Public Layer interface (`extends` plus locale defaults)
- [x] Default locale is English; URL strategy is `prefix_except_default`; Hosts add extra locales rather than the Layer hard-coding them
- [x] The Layer does not `extends` content, seo, Identity, or UI
- [x] Identity does not depend on this Layer
- [x] Lockstep version matches the other Starter Layers (`0.0.z`, additive)
- [x] Deep imports of this Layer’s Tiers fail the existing Public Layer interface lint fence
- [x] Playground Host `extends` list is unchanged (no visitor-facing i18n yet)
- [x] Lint, typecheck, and existing Identity tests stay green
