import type { IncomingMessage, ServerResponse } from 'node:http'
import { createServer } from 'node:http'
import { describe, expect, it } from 'vitest'
import { runSmokeCli, smokePreview } from '../../scripts/smoke-preview'

const jsonProbeHeaders = {
  'content-type': 'application/json',
  'cache-control': 'no-store',
}

const hostContractHeaders = {
  'content-type': 'text/html',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'content-security-policy-report-only': 'default-src \'self\'',
}

function sendJson(res: ServerResponse, status: number, body: { ok: boolean }) {
  res.writeHead(status, jsonProbeHeaders)
  res.end(JSON.stringify(body))
}

function sendHome(res: ServerResponse, headers: Record<string, string>) {
  res.writeHead(200, headers)
  res.end('<html></html>')
}

function sendDocs(res: ServerResponse) {
  res.writeHead(200, { 'content-type': 'text/html' })
  res.end('<html><body>Playground proof</body></html>')
}

function sendLogin(res: ServerResponse) {
  res.writeHead(200, { 'content-type': 'text/html' })
  res.end('<html><body>Sign in to the Playground</body></html>')
}

function sendRedirect(res: ServerResponse, location: string) {
  res.writeHead(302, { location })
  res.end()
}

function sendSitemap(res: ServerResponse, origin: string, paths: string[]) {
  const urls = paths.map((path) => {
    const loc = path === '/' ? `${origin}/` : `${origin}${path}`
    return `<url><loc>${loc}</loc></url>`
  }).join('')
  res.writeHead(200, { 'content-type': 'application/xml' })
  res.end(`<?xml version="1.0"?><urlset>${urls}</urlset>`)
}

function serveHostContract(req: IncomingMessage, res: ServerResponse) {
  const origin = `http://${req.headers.host}`
  if (req.url === '/health' || req.url === '/ready') {
    sendJson(res, 200, { ok: true })
    return
  }
  if (req.url === '/docs') {
    sendDocs(res)
    return
  }
  if (req.url === '/login') {
    sendLogin(res)
    return
  }
  if (req.url === '/protected') {
    sendRedirect(res, '/login')
    return
  }
  if (req.url === '/hr') {
    sendRedirect(res, '/hr/docs')
    return
  }
  if (req.url === '/sitemap.xml') {
    sendSitemap(res, origin, ['/', '/docs', '/hr/docs'])
    return
  }
  sendHome(res, hostContractHeaders)
}

/**
 * Fixture Host at the HTTP seam: smoke observes responses, not Coolify internals.
 */
async function listenFixtureHost(handler: (req: IncomingMessage, res: ServerResponse) => void) {
  const server = createServer(handler)
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const address = server.address()
  if (!address || typeof address === 'string')
    throw new Error('expected a TCP port for the fixture Host')
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
    }),
  }
}

describe('Playground Host smoke (preview and production)', () => {
  it('fails when health is not a live JSON 200', async () => {
    const fixture = await listenFixtureHost((_req, res) => {
      res.writeHead(503, { 'content-type': 'text/plain' })
      res.end('down')
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/health/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when readiness is not a live JSON 200', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/health') {
        sendJson(res, 200, { ok: true })
        return
      }
      sendJson(res, 503, { ok: false })
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/ready/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when CSP is enforced instead of report-only', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/health' || req.url === '/ready') {
        sendJson(res, 200, { ok: true })
        return
      }
      sendHome(res, {
        'content-type': 'text/html',
        'content-security-policy': 'default-src \'self\'',
      })
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/report-only|content-security-policy/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when baseline security headers are missing', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/health' || req.url === '/ready') {
        sendJson(res, 200, { ok: true })
        return
      }
      sendHome(res, {
        'content-type': 'text/html',
        'content-security-policy-report-only': 'default-src \'self\'',
      })
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/x-content-type-options|x-frame-options|referrer-policy/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when docs is 404 on a Host that is otherwise ready', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/docs') {
        res.writeHead(404, { 'content-type': 'text/html' })
        res.end('<html><body>Not Found</body></html>')
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/docs/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when /docs redirects instead of returning Playground proof', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/docs') {
        sendRedirect(res, '/en/docs')
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/docs: expected 200/)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when docs is 200 without Playground proof copy', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/docs') {
        sendHome(res, hostContractHeaders)
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/docs:.*Playground proof/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when /hr does not redirect to /hr/docs', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/hr') {
        sendHome(res, hostContractHeaders)
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/hr/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when the sitemap hides docs', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/sitemap.xml') {
        sendSitemap(res, `http://${req.headers.host}`, ['/'])
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/sitemap/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when the sitemap advertises Identity routes', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/sitemap.xml') {
        sendSitemap(res, `http://${req.headers.host}`, ['/', '/docs', '/hr/docs', '/login', '/register', '/protected'])
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/login|register|protected/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when the sitemap hides home', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/sitemap.xml') {
        sendSitemap(res, `http://${req.headers.host}`, ['/docs', '/hr/docs'])
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/sitemap/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when the sitemap hides Croatian docs', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/sitemap.xml') {
        sendSitemap(res, `http://${req.headers.host}`, ['/', '/docs'])
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/hr\/docs/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('follows a 307 sitemap index so listed docs are not a miss', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      const origin = `http://${req.headers.host}`
      if (req.url === '/sitemap.xml') {
        res.writeHead(307, { location: '/sitemap_index.xml' })
        res.end()
        return
      }
      if (req.url === '/sitemap_index.xml') {
        res.writeHead(200, { 'content-type': 'application/xml' })
        res.end(`<?xml version="1.0"?><sitemapindex><sitemap><loc>${origin}/sitemaps/en.xml</loc></sitemap><sitemap><loc>${origin}/sitemaps/hr.xml</loc></sitemap></sitemapindex>`)
        return
      }
      if (req.url === '/sitemaps/en.xml') {
        sendSitemap(res, origin, ['/', '/docs'])
        return
      }
      if (req.url === '/sitemaps/hr.xml') {
        sendSitemap(res, origin, ['/hr/docs'])
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.failures).toEqual([])
      expect(result.ok).toBe(true)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when /login redirects under a locale prefix', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/login') {
        sendRedirect(res, '/en/login')
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/login/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when /login is not English Playground copy', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/login') {
        res.writeHead(200, { 'content-type': 'text/html' })
        res.end('<html><body>Prijava</body></html>')
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/english|Playground/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('fails when anonymous /protected does not redirect to /login', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/protected') {
        sendHome(res, hostContractHeaders)
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url)
      expect(result.ok).toBe(false)
      expect(result.failures.join('\n')).toMatch(/protected/i)
    }
    finally {
      await fixture.close()
    }
  })

  it('passes when the shared Host HTTP contract matches, including Catalogue Layer paths', async () => {
    const fixture = await listenFixtureHost(serveHostContract)

    try {
      const result = await smokePreview(fixture.url)
      expect(result.failures).toEqual([])
      expect(result.ok).toBe(true)
    }
    finally {
      await fixture.close()
    }
  })

  it('waits until readiness is 200 before checking the rest of the contract', async () => {
    let readyHits = 0
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/ready') {
        readyHits += 1
        const ok = readyHits >= 3
        sendJson(res, ok ? 200 : 503, { ok })
        return
      }
      serveHostContract(req, res)
    })

    try {
      const result = await smokePreview(fixture.url, { waitMs: 2000, pollMs: 10 })
      expect(result.failures).toEqual([])
      expect(result.ok).toBe(true)
      expect(readyHits).toBeGreaterThanOrEqual(3)
    }
    finally {
      await fixture.close()
    }
  })

  it('smokes production from PRODUCTION_URL when PREVIEW_URL is unset', async () => {
    const fixture = await listenFixtureHost(serveHostContract)

    try {
      const code = await runSmokeCli([], { PRODUCTION_URL: fixture.url })
      expect(code).toBe(0)
    }
    finally {
      await fixture.close()
    }
  })
})
