import type { IdentityError } from './identity-result'
import { emailValidationMessage } from './email'
import { passwordValidationMessage } from './password'

// Shared so the fake and the Better Auth adapter reject the same inputs.
export function registerValidationError(email: string, password: string): Extract<IdentityError, { code: 'validation' }> | undefined {
  const emailMessage = emailValidationMessage(email)
  const passwordMessage = passwordValidationMessage(password)
  if (!emailMessage && !passwordMessage)
    return undefined
  return {
    code: 'validation',
    fields: {
      ...(emailMessage ? { email: emailMessage } : {}),
      ...(passwordMessage ? { password: passwordMessage } : {}),
    },
  }
}
