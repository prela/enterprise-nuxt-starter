import { z } from 'zod'

// Matches Better Auth’s default so the fake and the later adapter reject the same passwords.
const passwordSchema = z.string().min(8)

export function passwordValidationMessage(password: string): string | undefined {
  if (passwordSchema.safeParse(password).success)
    return undefined
  return 'Password is too weak'
}
