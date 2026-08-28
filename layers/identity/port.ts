// Public Layer interface. Products and tests import this module, never Tiers.
export { createIdentity } from './application/create-identity'
export type { IdentityPort } from './application/create-identity'
export type { IdentityError, IdentityResult } from './domain/identity-result'
export type { Principal } from './domain/principal'
