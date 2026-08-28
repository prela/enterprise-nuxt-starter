import type { IdentityError } from '#layers/identity/domain/identity-result'
import { z } from 'zod'

const loginPayloadSchema = z.object({
  email: z.string(),
  password: z.string(),
})

function statusFor(error: IdentityError): number {
  if (error.code === 'invalid-credentials')
    return 401
  return 400
}

export default defineEventHandler(async (event) => {
  // Authenticate rules stay in the Identity application service, not in Pinia or this handler.
  const parsed = loginPayloadSchema.safeParse(await readBody(event))
  const { identity, cookieHeaders } = await identityFromEvent(event)
  const result = await identity.authenticate({
    email: parsed.success ? parsed.data.email : '',
    password: parsed.success ? parsed.data.password : '',
  })

  if (!result.ok) {
    setResponseStatus(event, statusFor(result.error))
    return result
  }

  appendIdentityCookies(event, cookieHeaders)

  // Session lives in the httpOnly cookie, not in JSON the page could stash in localStorage.
  return {
    ok: true,
    data: {
      id: result.data.principal.id,
      email: result.data.principal.email,
    },
  }
})
