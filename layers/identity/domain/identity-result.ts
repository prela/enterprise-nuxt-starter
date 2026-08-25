// Error modes the Public Layer interface documents. HTTP later maps these codes,
// so adapters must not invent a parallel vocabulary.
export type IdentityError
  = | { code: 'validation', fields: { email?: string, password?: string } }
    | { code: 'duplicate-email' }
    | { code: 'invalid-credentials' }
    | { code: 'unauthenticated' }
    | { code: 'forbidden' }

export type IdentityResult<T>
  = | { ok: true, data: T }
    | { ok: false, error: IdentityError }
