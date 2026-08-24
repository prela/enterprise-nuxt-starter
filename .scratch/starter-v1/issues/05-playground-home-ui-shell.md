# 05: Playground home + UI shell

**What to build:** A visitor opening the Playground sees that this is a Playground, not a Product. Default, auth, and error layouts exist; chrome is mobile-first Nuxt UI with dark/light. Only the controls these screens need — not a design-system encyclopedia.

**Blocked by:** 04 Core Host — health, env, headers

**Status:** ready-for-agent

- [ ] Host extends a UI Nuxt Layer with a documented Public Layer interface
- [ ] Home page states this is a Playground, not a Product
- [ ] Default, auth, and error layouts exist in the UI Layer (Identity does not own chrome)
- [ ] Dark/light mode and mobile-first layout work on the shipped screens
- [ ] Nuxt UI is used; shadcn-vue only if Nuxt UI has no matching control
- [ ] Shipped UI meets WCAG 2.2 AA for what is on screen in this ticket
- [ ] Host does not deep-import UI internals
