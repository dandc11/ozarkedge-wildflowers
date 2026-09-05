// app/api/revalidate/route.js
import { Buffer } from 'node:buffer'
import { timingSafeEqual } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

/** Header Sanity signs each webhook with, formatted `t=<unix-ms>,v1=<hmac>`. */
const SIGNATURE_HEADER = 'sanity-webhook-signature'

/**
 * Oldest a webhook signature may be and still be accepted.
 *
 * `@sanity/webhook` verifies the HMAC against the timestamp carried inside the
 * header but never compares that timestamp to the current time, so on its own a
 * captured request replays indefinitely — and every replay forces a full purge,
 * which spends Sanity request quota. This window bounds that.
 *
 * Wide enough to absorb Sanity's delivery retries. If legitimate deliveries
 * start returning 401 because a retry arrived later than this, raise it.
 */
const MAX_SIGNATURE_AGE_MS = 10 * 60 * 1000

/**
 * Discards every cached page and the cached Sanity responses behind them.
 *
 * `revalidatePath` invalidates the route's stored HTML, and Next.js records an
 * implicit per-path tag on the fetches made while rendering that route, so the
 * cached Sanity responses should be discarded with it. That second half is the
 * load-bearing assumption of this whole design and is not yet confirmed against
 * a deployed environment — see the verification checklist in docs/CACHING.md.
 *
 * A route segment `export const revalidate` is deliberately not used: it cannot
 * override the `revalidate: false` that `sanityFetch` sets on every request, so
 * it would re-render pages against unchanged cached data.
 */
function purgeEverything() {
  // Covers every route rendered through the root layout, which is all of them.
  revalidatePath('/', 'layout')
  // Metadata routes sit outside the layout tree and need purging by path.
  revalidatePath('/sitemap.xml')
}

/**
 * Reads a required secret from the environment.
 *
 * @param {string} name - Environment variable to read.
 * @returns {{value?: string, response?: Response}} The value, or a 500 response
 *   to return when it is unset. Never falls open.
 */
function requireSecret(name) {
  const value = process.env[name]

  if (value) {
    return { value }
  }

  console.error(`${name} is not set — refusing to revalidate`)
  return {
    response: Response.json(
      { revalidated: false, reason: 'Server misconfigured' },
      { status: 500 },
    ),
  }
}

/**
 * Compares two strings without leaking their contents through timing.
 *
 * @param {string} a - First value.
 * @param {string} b - Second value.
 * @returns {boolean} True when the values are identical.
 */
function safeEqual(a, b) {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB)
}

/**
 * Reports whether a signature header is recent enough to act on.
 *
 * Checked before the HMAC so that a replayed request is rejected cheaply rather
 * than paying the ~3s Content Lake consistency wait inside `parseBody`. Reading
 * the timestamp before it is authenticated is safe: a forged one fails the HMAC
 * check immediately afterwards.
 *
 * Timestamps in the future are allowed through — the value is covered by the
 * signature, so a future reading means Sanity's clock is ahead, not tampering.
 *
 * @param {string | null} header - Raw `sanity-webhook-signature` header.
 * @returns {boolean} True when the header carries a timestamp within the window.
 */
function isFreshSignature(header) {
  const timestamp = Number(/^t=(\d+)/.exec(header ?? '')?.[1])

  if (!Number.isFinite(timestamp)) {
    return false
  }

  return Date.now() - timestamp <= MAX_SIGNATURE_AGE_MS
}

/**
 * Sanity webhook receiver that clears the cache when content changes.
 *
 * The payload is deliberately ignored. Clearing everything costs about one full
 * set of Sanity queries per publish, which is negligible at this publishing rate,
 * and it cannot miss indirect dependencies — a plant rendered inside another
 * plant's "Growing Nearby" section, for instance.
 *
 * @param {Request} request - Signed webhook request from Sanity.
 * @returns {Promise<Response>} 200 once the cache is cleared; 401 for a missing,
 *   stale, or invalid signature; 400 for an unparseable body; 500 when the
 *   secret is unset.
 */
export async function POST(request) {
  const { value: secret, response: misconfigured } = requireSecret('SANITY_REVALIDATE_SECRET')

  if (misconfigured) {
    return misconfigured
  }

  if (!isFreshSignature(request.headers.get(SIGNATURE_HEADER))) {
    return Response.json(
      { revalidated: false, reason: 'Missing or stale signature' },
      { status: 401 },
    )
  }

  let isValidSignature
  try {
    ;({ isValidSignature } = await parseBody(request, secret))
  } catch (error) {
    console.error('Revalidation webhook could not parse the request body:', error)
    return Response.json({ revalidated: false, reason: 'Malformed request' }, { status: 400 })
  }

  if (!isValidSignature) {
    return Response.json({ revalidated: false, reason: 'Invalid signature' }, { status: 401 })
  }

  purgeEverything()

  return Response.json({ revalidated: true, trigger: 'webhook' })
}

/**
 * Scheduled backstop, invoked by the Vercel cron job declared in vercel.json.
 *
 * Webhook deliveries can be missed — a deploy mid-delivery, a transient network
 * failure. Without this, a missed delivery leaves content stale until the next
 * deployment, because nothing else ever expires a cached page.
 *
 * Vercel authenticates cron invocations by sending `Authorization: Bearer
 * $CRON_SECRET`, so the same endpoint stays closed to everyone else.
 *
 * @param {Request} request - Scheduled request from Vercel Cron.
 * @returns {Promise<Response>} 200 once the cache is cleared; 401 for a missing or
 *   incorrect token; 500 when the secret is unset.
 */
export async function GET(request) {
  const { value: cronSecret, response: misconfigured } = requireSecret('CRON_SECRET')

  if (misconfigured) {
    return misconfigured
  }

  const authorization = request.headers.get('authorization')

  if (!authorization || !safeEqual(authorization, `Bearer ${cronSecret}`)) {
    return Response.json({ revalidated: false, reason: 'Unauthorized' }, { status: 401 })
  }

  purgeEverything()

  return Response.json({ revalidated: true, trigger: 'cron' })
}
