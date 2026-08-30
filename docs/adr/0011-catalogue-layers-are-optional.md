# i18n, Content, and SEO are optional Nuxt Layers

A future docs Product must take them and omit Identity; a PMS must take Identity and omit them. Those capabilities therefore live in `@starter/i18n`, `@starter/content`, and `@starter/seo`, not in Core or UI. The Host composes them; the Layers do not `extends` each other. Dumping i18n or Nuxt SEO into Core would make omit impossible. In 0.x, adding these Layers is additive lockstep `0.0.z`; a `0.Y` bump is only a break of an existing public Layer interface (ADR-0005).
