/**
 * @jest-environment node
 */
import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

import { GET, POST } from './route'

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))
jest.mock('next-sanity/webhook', () => ({ parseBody: jest.fn() }))

const WEBHOOK_SECRET = 'webhook-secret-value'
const CRON_SECRET = 'cron-secret-value'
const ENDPOINT = 'https://ozarkedgewildflowers.com/api/revalidate'
const ELEVEN_MINUTES_MS = 11 * 60 * 1000

/**
 * `next/jest` loads .env files into process.env, and .env.local already defines
 * SANITY_REVALIDATE_SECRET. Capture whatever is there so teardown restores it
 * rather than deleting it for the rest of the worker.
 */
const ORIGINAL_ENV = {
  SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
  CRON_SECRET: process.env.CRON_SECRET,
}

const restoreEnv = () => {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

const postRequest = ({ signedAt = Date.now(), signature } = {}) =>
  new Request(ENDPOINT, {
    method: 'POST',
    headers: signature === null ? {} : { [`sanity-webhook-signature`]: `t=${signedAt},v1=hmac` },
    body: JSON.stringify({ _type: 'nativePlant' }),
  })

const getRequest = (authorization) =>
  new Request(ENDPOINT, {
    method: 'GET',
    headers: authorization ? { authorization } : {},
  })

/** Both handlers log to console.error on the misconfiguration path. */
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(restoreEnv)

describe('POST /api/revalidate (Sanity webhook)', () => {
  beforeEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = WEBHOOK_SECRET
  })

  it('purges the whole route tree when the signature is valid and fresh', async () => {
    parseBody.mockResolvedValue({ body: {}, isValidSignature: true })

    const response = await POST(postRequest())

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ revalidated: true, trigger: 'webhook' })
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
  })

  it('rejects a replayed signature older than the freshness window', async () => {
    const response = await POST(postRequest({ signedAt: Date.now() - ELEVEN_MINUTES_MS }))

    expect(response.status).toBe(401)
    // Rejected before the HMAC check, so the ~3s consistency wait is never paid
    expect(parseBody).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('accepts a signature timestamp in the future, which means clock skew not tampering', async () => {
    parseBody.mockResolvedValue({ body: {}, isValidSignature: true })

    const response = await POST(postRequest({ signedAt: Date.now() + ELEVEN_MINUTES_MS }))

    expect(response.status).toBe(200)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })

  it('rejects a request carrying no signature header without purging', async () => {
    const response = await POST(postRequest({ signature: null }))

    expect(response.status).toBe(401)
    expect(parseBody).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects a malformed signature header without purging', async () => {
    const request = new Request(ENDPOINT, {
      method: 'POST',
      headers: { 'sanity-webhook-signature': 'not-a-signature' },
      body: '{}',
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(parseBody).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects a fresh but incorrectly signed request without purging', async () => {
    parseBody.mockResolvedValue({ body: {}, isValidSignature: false })

    const response = await POST(postRequest())

    expect(response.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns 400 without purging when the body cannot be parsed', async () => {
    parseBody.mockRejectedValue(new SyntaxError('Unexpected token in JSON'))

    const response = await POST(postRequest())

    expect(response.status).toBe(400)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('refuses to verify or purge when the signing secret is unset', async () => {
    delete process.env.SANITY_REVALIDATE_SECRET

    const response = await POST(postRequest())

    expect(response.status).toBe(500)
    expect(parseBody).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})

describe('GET /api/revalidate (scheduled backstop)', () => {
  beforeEach(() => {
    process.env.CRON_SECRET = CRON_SECRET
  })

  it('purges the whole route tree when the cron token matches', async () => {
    const response = await GET(getRequest(`Bearer ${CRON_SECRET}`))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ revalidated: true, trigger: 'cron' })
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
  })

  it('rejects a request with no authorization header', async () => {
    const response = await GET(getRequest())

    expect(response.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects a wrong token of identical length', async () => {
    // Equal length exercises the constant-time comparison rather than the length guard
    const forged = `Bearer ${'x'.repeat(CRON_SECRET.length)}`

    const response = await GET(getRequest(forged))

    expect(response.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects a wrong token of a different length', async () => {
    const response = await GET(getRequest('Bearer short'))

    expect(response.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('refuses to purge when the cron secret is unset', async () => {
    delete process.env.CRON_SECRET

    const response = await GET(getRequest('Bearer anything'))

    expect(response.status).toBe(500)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
