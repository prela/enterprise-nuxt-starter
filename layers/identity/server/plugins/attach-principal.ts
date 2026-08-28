export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    // Only Identity HTML that must show the principal after SSR refresh; skip JSON probes.
    if (getRequestURL(event).pathname !== '/login')
      return
    try {
      event.context.identityPrincipal = await currentPrincipalFromEvent(event)
    }
    catch {
      event.context.identityPrincipal = null
    }
  })
})
