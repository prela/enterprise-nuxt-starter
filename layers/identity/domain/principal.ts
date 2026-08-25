// The caller’s view of who is signed in. Adapters may store more; this is the port.
export interface Principal {
  id: string
  email: string
}

// Opaque to callers so a later Better Auth session cookie can replace this string.
export type SessionToken = string
