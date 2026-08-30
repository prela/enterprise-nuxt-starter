# 04: Playground extends catalogue Layers and proves docs (7.4)

**Parent:** `.scratch/phase-7-catalogue/spec.md`

**What to build:** A Playground visitor can read three English docs, open Croatian siblings under `/hr/docs`, and is redirected from `/hr` to `/hr/docs`. Docs are prerendered; Identity stays English SSR, off the sitemap, and still works (register, log in, protected page, log out). Proof copy states this is Playground proof, not the Product.

**Blocked by:** 01 Scaffold i18n Nuxt Layer (7.1), 02 Scaffold Content Nuxt Layer (7.2), 03 Scaffold SEO Nuxt Layer (7.3)

**Status:** ready-for-human

- [x] Playground Host `extends` i18n, content, and seo in addition to Core, UI, and Identity
- [x] Host adds the `hr` locale; default locale remains English with `prefix_except_default`
- [x] Host owns three English `docs` pages and three `hr` suffix siblings; copy says Playground proof, not the Product; no Bible/`CONTEXT.md`/ADR ingest
- [x] `/docs` is 200 with navigation to a second doc and surroundings links
- [x] `/hr/docs` is 200 with Croatian fixture copy; `/login` stays English and unprefixed
- [x] `/hr` redirects to `/hr/docs`; `/` stays the English Playground home
- [x] `/docs/**` (including localized docs) is prerendered; Identity routes stay SSR
- [x] Sitemap includes home and English/Croatian docs; excludes `/login`, `/register`, `/protected`; Identity routes are `noindex`
- [x] Open Graph is present on at least one docs page
- [x] Host HTTP tests cover docs HTML, `/hr` redirect, and sitemap body; Playwright covers docs nav, Croatian fixture, English login, and the existing Identity slice
- [x] Identity port tests and coverage gates stay green
- [x] TDD: failing Host HTTP/UI tests before wiring pages and `extends`
