# Playground Host lives at the repository root

The v1 slice needs a deployable Playground that `extends` Core, UI, and Identity. The Host is therefore this repository’s Nuxt app (`app/`, root `nuxt.config.ts`); Nuxt Layers live at `layers/core`, `layers/ui`, `layers/identity`, each with its own `package.json` for later publish. A pnpm `apps/playground` workspace would add packaging work before anything is published; a layers-only repo would have no Playground to deploy.
