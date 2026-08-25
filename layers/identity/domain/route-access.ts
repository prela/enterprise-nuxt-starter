// v1 Playground’s member-only page. Middleware later calls may-access-route with this path.
export function routeRequiresPrincipal(route: string): boolean {
  return route === '/protected' || route.startsWith('/protected/')
}
