import { z } from 'zod'

// Port-level email check so every adapter returns the same validation error mode.
const emailSchema = z.email()

export function emailValidationMessage(email: string): string | undefined {
  if (emailSchema.safeParse(email).success)
    return undefined
  return 'Email is invalid'
}
