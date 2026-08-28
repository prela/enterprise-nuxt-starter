import type { IdentityError } from '#layers/identity/domain/identity-result'
import { z } from 'zod'

const registerPayloadSchema = z.object({
  email: z.string(),
  password: z.string(),
})

function statusFor(error: IdentityError): number {
  if (error.code === 'validation')
    return 400
  if (error.code === 'duplicate-email')
    return 409
  return 400
}

export default defineEventHandler(async (event) => {
  // Register rules stay in the Identity application service, not in Pinia or this handler.
  const parsed = registerPayloadSchema.safeParse(await readBody(event))
  const { identity, cookieHeaders } = await identityFromEvent(event)
  const result = await identity.register({
    email: parsed.success ? parsed.data.email : '',
    password: parsed.success ? parsed.data.password : '',
  })

  if (!result.ok) {
    setResponseStatus(event, statusFor(result.error))
    return result
  }

  appendIdentityCookies(event, cookieHeaders)

  setResponseStatus(event, 201)
  return result
})
