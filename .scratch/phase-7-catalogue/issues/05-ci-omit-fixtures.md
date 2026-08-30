# 05: CI omit fixtures (7.5)

**Parent:** `.scratch/phase-7-catalogue/spec.md`

**What to build:** CI boots two Hosts that are never deployed: a docs-shaped Host (Core, UI, content, seo, i18n — no Identity) and a PMS-shaped Host (Core, UI, Identity — no content, seo, or i18n). A Product can take or omit those Layers without a second Coolify app.

**Blocked by:** 04 Playground extends catalogue Layers and proves docs (7.4)

**Status:** ready-for-human

- [x] Docs-shaped omit fixture `extends` Core, UI, content, seo, and i18n only; it boots in CI; `/` is 200; Identity routes are absent
- [x] PMS-shaped omit fixture `extends` Core, UI, and Identity only; it boots in CI; `/login` is 200; `/docs` is absent
- [x] Both fixtures still satisfy Core’s PostgreSQL boot contract
- [x] Neither fixture is deployed (not a second Playground; ADR-0007)
- [x] TDD: failing fixture-boot tests before fixture configs
- [x] Playground remain extend-all; existing Identity E2E and coverage gates stay green
