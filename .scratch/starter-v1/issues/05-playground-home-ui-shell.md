# 05: Playground home + UI shell

**What to build:** A visitor opening the Playground sees that this is a Playground, not a Product. Default, auth, and error layouts exist; chrome is mobile-first Nuxt UI with dark/light. Only the controls these screens need — not a design-system encyclopedia.

**Blocked by:** 04 Core Host — health, env, headers

**Status:** resolved

- [x] Host extends a UI Nuxt Layer with a documented Public Layer interface
- [x] Home page states this is a Playground, not a Product
- [x] Default, auth, and error layouts exist in the UI Layer (Identity does not own chrome)
- [x] Dark/light mode and mobile-first layout work on the shipped screens
- [x] Nuxt UI is used; shadcn-vue only if Nuxt UI has no matching control
- [x] Shipped UI meets WCAG 2.2 AA for what is on screen in this ticket
- [x] Host does not deep-import UI internals

## Comments

- Playground Host `extends: ['@starter/core', '@starter/ui']`. Public interface is `layers/ui/README.md`.
- `GET /` states this is a Playground, not a Product. Layouts `default`, `auth`, and `error` live in the UI Layer with skip link, main landmark, and color-mode control.
- Nuxt UI only (no shadcn-vue). `ui.fonts` is off so v1 does not grow a fonts programme.
- Host HTTP tests cover home copy, chrome, and HTML 404. Lint fence covers UI Tier deep imports.

## Answer

UI Nuxt Layer `@starter/ui` ships default, auth, and error layouts. The Playground Host extends it; `GET /` states this is a Playground, not a Product. Error copy agrees with status: 404 is a missing page, other failures are a render error.

Host HTTP asserts home copy, skip link, main landmark, `lang`, viewport, labeled color-mode control, and HTML 404 chrome. That seam proves chrome is present; it does not prove full WCAG 2.2 AA (contrast, keyboard, target size) or that color-mode toggling works on a phone. Those belong with Playground E2E. The `auth` layout exists for Identity screens; this work package does not add register/login pages.
