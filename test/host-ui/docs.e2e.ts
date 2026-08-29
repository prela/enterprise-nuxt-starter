import { expect, test } from './nuxt-test'

// Seam: Host HTTP/UI. Docs proof is observed as a visitor's browser would see it —
// not via Content queries, vue-i18n internals, or Nuxt SEO option objects.

test('visitor can open docs, follow nav, see Croatian fixture, and keep English login', async ({ goto, page }) => {
  await goto('/docs', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Playground proof')

  await page.getByRole('navigation', { name: 'Docs' }).getByRole('link', { name: 'Getting started with the Playground' }).click()
  await expect(page).toHaveURL(/\/docs\/getting-started/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Getting started with the Playground')
  await expect(page.getByRole('navigation', { name: 'Surroundings' })).toBeVisible()

  await goto('/hr/docs', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dokaz Playgrounda')

  await goto('/login', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
  await expect(page.getByText('Sign in to the Playground')).toBeVisible()
})
