# Enterprise Nuxt Starter

The shared foundation from which market-specific Products are built. This context is not a PMS, a rental system, or a marketing site.

## Language

**Starter**:
The shared foundation this repository produces: Nuxt Layers plus a thin host that Products extend.
_Avoid_: template, boilerplate, platform, framework

**Product**:
A separate deployable application for a market (PMS, rental, marketing site) that extends the Starter.
_Avoid_: service, add-on, module, vertical

**Playground**:
The in-repo application used to prove Starter Layers before a real Product exists. It is the Host at the repository root.
_Avoid_: demo, example app, sandbox

**Host**:
A Nuxt application that `extends` the Nuxt Layers. The deployable Host is the Playground at the repository root.
_Avoid_: app (unqualified), root app

**Omit fixture**:
A CI-only Host that extends a subset of Nuxt Layers to prove a Product can take or omit them. It is never deployed.
_Avoid_: second Playground, demo Host, sandbox

**Work package**:
The smallest planned unit of work: one feature branch and one PR into `develop`. IDs follow the v1 WBS (`0.1`, `1.1`, `3.3`, …) and are not SemVer tags.
_Avoid_: task, phase (a phase groups work packages)

**Nuxt Layer**:
A distributable Nuxt `extends` package that a Product can take or omit.
_Avoid_: layer (unqualified), module, package

**Tier**:
A code seam inside a Nuxt Layer or Product: presentation, application, domain, or infrastructure.
_Avoid_: layer (when meaning these four), level

**Identity**:
Who a user is and whether they may access a route. Hosted identity providers are adapters, not Identity itself.
_Avoid_: auth, authentication, auth module (as the concept name)

**Principal**:
Who a user is once Identity has a Session: a stable id and email.
_Avoid_: user (unqualified), Better Auth user

**Session**:
Proof Identity holds that a request belongs to a Principal. The Starter owns it as an httpOnly cookie, not a value a page script can store.
_Avoid_: JWT, access token, session token, Better Auth cookie

**Application service**:
Domain or application logic behind a Tier seam. Not a deployable Product.
_Avoid_: service (unqualified)

**Public Layer interface**:
The types, composables, and documented entrypoints a Product is allowed to import from a Nuxt Layer.
_Avoid_: API (unqualified), internals, deep import

**Bible**:
The owner-locked policy file `project.md`. Agents follow it; they do not edit it without owner approval.
_Avoid_: spec, constitution, project_config
