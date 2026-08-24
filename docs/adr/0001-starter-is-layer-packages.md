# Starter is published Nuxt Layers, not a clone-once template

A Product must be able to take Starter upgrades without a one-way fork. This repository therefore publishes Nuxt Layers and hosts a Playground app to prove them; Products are separate deployable applications that `extends` those Layers. A clone-once GitHub template would diverge on day one; a monorepo of Products would couple unrelated release cycles.
