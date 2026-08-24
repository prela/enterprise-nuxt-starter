# Lockstep 0.x SemVer for all Nuxt Layers

Until a production Product depends on the Starter, every Nuxt Layer shares one version and that version stays 0.y.z so public-interface breaks are honest and cheap (a 0.Y bump). Independent per-Layer versions would be a publishing problem we do not have; calendar versions would not tell a Product whether an upgrade breaks `extends`. After 1.0.0, MAJOR is a breaking public Layer interface, MINOR a backward-compatible capability or new Layer, PATCH a fix. Conventional Commits feed the changelog.
