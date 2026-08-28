// Public Layer interface. Products and tests import this module, never Tiers.
export { createIdentity } from './application/create-identity'
export type { ActiveSession, IdentityPort } from './application/create-identity'
export type { IdentityError, IdentityResult } from './domain/identity-result'
export type { Principal, SessionToken } from './domain/principal'
