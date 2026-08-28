// The caller’s view of who is signed in. Adapters may store more; this is the port.
export interface Principal {
  id: string
  email: string
}
