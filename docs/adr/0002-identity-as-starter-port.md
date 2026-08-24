# Identity is a Starter Nuxt Layer behind a port

Landing-page Products may omit login; a PMS Product will not. Identity therefore lives in the Starter as an optional Nuxt Layer whose core is a port (sessions we own). Hosted identity providers are adapters, not the Layer’s public contract — wiring Clerk or Auth0 as the only path would lock every Product to that vendor.
