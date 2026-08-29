import { fileURLToPath } from 'node:url'
import { fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))

describe('host HTTP docs', async () => {
  await setup({
    rootDir,
    browser: false,
    server: true,
  })

  it('docs is 200 with Playground proof copy, not a Product handbook', async () => {
    const response = await fetch('/docs', { headers: { accept: 'text/html' } })
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toMatch(/Playground proof/)
    expect(html).toMatch(/not the Product/)
  })

  it('docs navigation reaches a second doc and shows surroundings links', async () => {
    const index = await fetch('/docs', { headers: { accept: 'text/html' } })
    const indexHtml = await index.text()

    expect(indexHtml).toMatch(/Getting started with the Playground/)

    const second = await fetch('/docs/getting-started', { headers: { accept: 'text/html' } })
    const secondHtml = await second.text()

    expect(second.status).toBe(200)
    expect(secondHtml).toMatch(/Getting started with the Playground/)
    expect(secondHtml).toMatch(/aria-label="Surroundings"/)
    expect(secondHtml).toMatch(/Catalogue Layers in the Playground/)
  })

  it('croatian docs is 200 with fixture copy; login stays English and unprefixed', async () => {
    const docs = await fetch('/hr/docs', { headers: { accept: 'text/html' } })
    const docsHtml = await docs.text()

    expect(docs.status).toBe(200)
    expect(docsHtml).toMatch(/Dokaz Playgrounda/)

    const login = await fetch('/login', { headers: { accept: 'text/html' } })
    const loginHtml = await login.text()

    expect(login.status).toBe(200)
    expect(loginHtml).toMatch(/Log in/)
    expect(loginHtml).toMatch(/Sign in to the Playground/)
  })

  it('croatian home redirects to Croatian docs; English home stays the Playground', async () => {
    const hr = await fetch('/hr', { redirect: 'manual', headers: { accept: 'text/html' } })

    expect(hr.status).toBeGreaterThanOrEqual(300)
    expect(hr.status).toBeLessThan(400)
    expect(hr.headers.get('location')).toMatch(/\/hr\/docs/)

    const home = await fetch('/', { headers: { accept: 'text/html' } })
    const homeHtml = await home.text()

    expect(home.status).toBe(200)
    expect(homeHtml).toMatch(/Playground/)
    expect(homeHtml).toMatch(/not a Product/)
  })

  it('sitemap lists home and English and Croatian docs; excludes Identity routes', async () => {
    const index = await fetch('/sitemap.xml')
    const indexXml = await index.text()
    expect(index.status).toBe(200)

    const childPaths = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
      return new URL(match[1]).pathname
    })
    const bodies = [indexXml]
    for (const path of childPaths) {
      const child = await fetch(path)
      expect(child.status).toBe(200)
      bodies.push(await child.text())
    }
    const xml = bodies.join('\n')

    expect(xml).toMatch(/\/docs/)
    expect(xml).toMatch(/\/hr\/docs/)
    expect(xml).not.toMatch(/\/login/)
    expect(xml).not.toMatch(/\/register/)
    expect(xml).not.toMatch(/\/protected/)
    // Home is the unprefixed Playground origin, not a docs path.
    expect(xml).toMatch(/http:\/\/127\.0\.0\.1:3000\/</)
  })

  it('docs HTML includes Open Graph; Identity routes are noindex', async () => {
    const docs = await fetch('/docs', { headers: { accept: 'text/html' } })
    const docsHtml = await docs.text()

    expect(docsHtml).toMatch(/property="og:title"|name="og:title"/)

    const login = await fetch('/login', { headers: { accept: 'text/html' } })
    const loginHtml = await login.text()
    const robots = `${login.headers.get('x-robots-tag') ?? ''} ${loginHtml}`

    expect(robots).toMatch(/noindex/i)
  })
})
