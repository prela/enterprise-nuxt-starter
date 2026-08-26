import { routeRequiresPrincipal } from '#layers/identity/domain/route-access'

export default defineEventHandler(async (event) => {
  const route = getRequestURL(event).pathname
  // Skip Identity construction on public HTML and probes; the port still decides /protected.
  if (!routeRequiresPrincipal(route))
    return

  const session = sessionTokenFromEvent(event)
  const { identity } = await identityFromEvent(event)
  // Authorization is the port’s may-access-route, not Better Auth session types.
  if (await identity.mayAccessRoute({ session, route }))
    return

  return sendRedirect(event, '/login')
})
