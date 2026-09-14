# 02: Lockstep 0.1.0 and honest docs (7.7)

**Parent:** `.scratch/lockstep-0.1.0/spec.md`

**What to build:** Every Nuxt Layer shares lockstep `0.1.0`. Catalogue Layer is in the glossary. The Bible matches the owner-approved outline plus WBS `7.6` and `7.7`. Humans are no longer told the Host extends three Nuxt Layers. The ticket 04 accept record lives on this feature branch, not as further commits on `develop`.

**Blocked by:** 01 Deployed-origin catalogue smoke (7.6)

**Status:** resolved

- [x] Core, UI, Identity, i18n, content, and seo are lockstep `0.1.0`
- [x] Lockstep accepts tag `v0.1.0` and still rejects `1.0.0` and work package ids
- [x] Catalogue Layer is in the glossary (i18n, content, seo; not fonts, image, or scripts)
- [x] Bible: vocabulary Catalogue Layer; v1 Layers vs current Catalogue Layers; layout tree six directories and Host `extends` all six; WBS `7+` says `7.1`–`7.5` done and still not image/fonts/scripts, npm, or a docs Product; rows `7.6` (depends on `7.4`) and `7.7` (depends on `7.5` and `7.6`); future-proof smoke includes catalogue Host HTTP
- [x] Bible does not rewrite v1 WBS `0.1`–`6.2` or v1 non-goals; no Phase 8; no Product
- [x] README describes six Nuxt Layers and lockstep `0.y.z`, not “all three”
- [x] Ticket 04 accept record is on `feature/7.7-lockstep-0.1.0`, not new commits on `develop`
- [x] No npm publish; no fonts, image, or scripts Nuxt Layers

## Answer

Every Nuxt Layer is lockstep `0.1.0`. `pnpm lockstep --tag v0.1.0` is ok; `v1.0.0` and work package ids still fail. Catalogue Layer is in `CONTEXT.md`. The Bible names Catalogue Layer, lists six Layer directories, records `7.6`/`7.7`, and leaves v1 WBS `0.1`–`6.2` and v1 non-goals alone. README says six Nuxt Layers. Ticket 04 accept is cherry-picked onto this branch, not onto `develop`.
