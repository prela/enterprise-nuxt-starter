# 04: Playground extends catalogue Layers and proves docs (7.4)

**Parent:** `.scratch/phase-7-catalogue/spec.md`

**What to build:** A Playground visitor can read three English docs, open Croatian siblings under `/hr/docs`, and is redirected from `/hr` to `/hr/docs`. Docs are prerendered; Identity stays English SSR, off the sitemap, and still works (register, log in, protected page, log out). Proof copy states this is Playground proof, not the Product.

**Blocked by:** 01 Scaffold i18n Nuxt Layer (7.1), 02 Scaffold Content Nuxt Layer (7.2), 03 Scaffold SEO Nuxt Layer (7.3)

**Status:** resolved

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

## Comments

### Owner QA (2026-09-10) — reject

Coolify Playground preview origin from GitHub Actions variable `PREVIEW_URL`: `https://playground-8lcmamhreq0b5uktqba8k775.167.235.21.56.sslip.io`. Preview was up (`GET /ready` 200). Did not fall back to `pnpm dev`.

Visitor check that held:

- `GET /` 200 — heading “This is a Playground, not a Product”. English, unprefixed.

Visitor checks that failed (stopped here; did not continue register → log in → `/protected` → log out):

- `GET /docs` 404 — browser shows Playground chrome “Page not found”; `Accept` without HTML returns Nitro JSON `{ statusCode: 404, path: "/docs" }`.
- Same 404: `/docs/getting-started`, `/hr/docs`, `/hr` (no redirect to `/hr/docs`), `/sitemap.xml`.
- Identity routes still answer: `/login` and `/register` 200 English unprefixed; anonymous `/protected` 302 → `/login`.

`robots.txt` is `User-Agent: *` / `Disallow:` with `Last-Modified: Fri, 28 Aug 2026` (before the 7.4 merge). Preview smoke only asserts `/ready` and headers, so it stayed green.

Not accepted. Do not treat checkboxes as owner-verified. No code change from this QA.

### Owner QA (2026-09-12) — accept

Re-ran visitor QA on the same Coolify Playground preview origin, on `develop` at `80fe1dc` (PR #40 merged: skip fail-closed env during Nitro prerender). The 10 Sep reject is stale: Coolify is no longer the 28 Aug image.

Visitor checks that held (browser, as a visitor; Identity slice was clicked):

- `GET /` — heading “This is a Playground, not a Product”. English Playground home, not a Product.
- `GET /docs` 200 — heading “Playground proof”; copy “This is Playground proof, not the Product.” Docs nav to “Getting started with the Playground” (`/docs/getting-started`); Surroundings navigation present.
- `GET /hr/docs` 200 — heading “Dokaz Playgrounda”; Croatian fixture copy. `GET /hr` 302 → `/hr/docs`.
- `GET /login` stays English and unprefixed (“Log in” / “Sign in to the Playground”).
- Register → log in → `/protected` (“Protected page” / “Identity is working.”) → log out still works. After logout, `/protected` returns to `/login`.
- `/sitemap.xml` 307 → `/sitemap_index.xml` (not a miss). Index lists `en.xml` and `hr.xml`. Followed bodies include home, `/docs`, and `/hr/docs`. Identity routes `/login`, `/register`, `/protected` are not advertised.

Accepted. No lockstep bump, no `develop` → `main`, no smoke or diagnose-script change from this QA.

## Answer

Coolify Playground preview on current `develop` proves the catalogue Nuxt Layers. A visitor can read English docs and the Croatian fixture, `/hr` redirects to `/hr/docs`, `/` stays the English Playground home, Identity stays English and unprefixed and still works, and the sitemap lists home and docs without advertising Identity routes.
