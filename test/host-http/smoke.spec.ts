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

describe('preview smoke (Host HTTP)', () => {
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

  it('passes when health, readiness, headers, and CSP report-only match the Host HTTP contract', async () => {
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/health' || req.url === '/ready') {
        sendJson(res, 200, { ok: true })
        return
      }
      sendHome(res, hostContractHeaders)
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

  it('waits until readiness is 200 before checking the rest of the contract', async () => {
    let readyHits = 0
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/ready') {
        readyHits += 1
        const ok = readyHits >= 3
        sendJson(res, ok ? 200 : 503, { ok })
        return
      }
      if (req.url === '/health') {
        sendJson(res, 200, { ok: true })
        return
      }
      sendHome(res, hostContractHeaders)
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
    const fixture = await listenFixtureHost((req, res) => {
      if (req.url === '/health' || req.url === '/ready') {
        sendJson(res, 200, { ok: true })
        return
      }
      sendHome(res, hostContractHeaders)
    })

    try {
      const code = await runSmokeCli([], { PRODUCTION_URL: fixture.url })
      expect(code).toBe(0)
    }
    finally {
      await fixture.close()
    }
  })
})
