import { expect, test } from '@nuxt/test-utils/playwright'

// Seam: Host HTTP/UI. The Identity slice is observed as a visitor's browser
// would see it — not via fetch(), port imports, or Better Auth types.

test('visitor can register, log in, open the protected page, and log out', async ({ goto, page }) => {
  const email = `member-${crypto.randomUUID()}@example.com`
  const password = 'password1'

  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Playground')

  await page.getByRole('link', { name: 'Register' }).click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Playground')

  await goto('/login', { waitUntil: 'hydration' })
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Playground')

  const cookies = await page.context().cookies()
  // Session cookie must be unreadable to page JavaScript; CSRF’s cookie is not the session.
  expect(cookies.some(cookie =>
    cookie.httpOnly && !/^csrf$/i.test(cookie.name) && !/^__Host-csrf$/i.test(cookie.name),
  )).toBe(true)

  await goto('/protected', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading', { name: 'Protected page' })).toBeVisible()
  await expect(page.getByText('Identity is working')).toBeVisible()

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Playground')

  await goto('/protected', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
  await expect(page.getByText('Identity is working')).toHaveCount(0)
})
