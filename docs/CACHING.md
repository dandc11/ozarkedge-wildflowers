# Caching & Revalidation

How published content reaches the live site, what holds a stale copy, and what clears it.

## The short version

Every reader-facing route is prerendered, and `sanityFetch` caches its queries with
`revalidate: false` — nothing expires on its own. Content becomes visible because
something explicitly discards the cached copy:

| Trigger                                 | Reaches                    | Speed          |
| --------------------------------------- | -------------------------- | -------------- |
| Sanity webhook → `POST /api/revalidate` | Everyone                   | Seconds        |
| `<SanityLive />` in an open browser tab | Everyone, if a tab is open | Seconds        |
| Vercel cron → `GET /api/revalidate`     | Everyone                   | Daily backstop |
| A deployment                            | Everyone                   | Per deploy     |

The webhook is the primary path. The cron job exists because webhook deliveries can be
missed and nothing else would ever expire the page.

## The layers

**Full Route Cache** — the rendered HTML for each route, produced at build time or on
first request. Persists until purged.

**Data Cache** — the stored result of each Sanity query. `next-sanity`'s `defineLive`
issues every request with `next: { revalidate: false, tags: [...] }`, so these entries
never expire on their own either. They are tagged, which is what makes targeted purging
possible.

**Vercel edge cache** — serves the stored HTML. Responses carry
`cache-control: public, max-age=0, must-revalidate`, so browsers always revalidate and
never hold a stale copy locally. Browser caching is not a factor here; mobile and
desktop share one cache entry (`User-Agent` is not in the `vary` header).

## Why `<SanityLive />` is not sufficient on its own

`<SanityLive />` (mounted in `app/layout.js` for production and Draft Mode) is a **client**
component. It subscribes to Sanity's Live Content API from the visitor's browser and calls
a server action that runs `revalidateTag`, so it genuinely does clear the server cache —
not just refresh the current tab.

Its weakness is the trigger. The chain is: content published → Sanity pushes an event → _a
browser with the site open_ receives it → that browser calls the server action → cache
cleared. With no visitor present at the moment of publishing, the event reaches nobody. The
Studio doesn't count; it runs on a different origin and doesn't mount this component.

Keep it — it's valuable for editors watching a page live. It just can't be the only path.

## Why there is no `export const revalidate`

This looks like the obvious way to add a time-based backstop, and it does not work here.
From the Next.js route segment config docs:

> Set the default revalidation time for a layout or page. This option does not override the
> `revalidate` value set by individual `fetch` requests.

`sanityFetch` sets `revalidate: false` on every request, so a segment-level value is
ignored for the data. The page HTML would expire on the timer, re-render, read the same
never-expiring cached Sanity responses, and produce byte-identical output — work performed,
nothing refreshed.

`revalidatePath` is different: it invalidates the route's stored HTML, and Next.js records an
implicit per-path tag on the fetches made while rendering that route, so the cached Sanity
responses should be discarded with it. That is why the backstop is a scheduled
`revalidatePath` call rather than a segment timer.

> **This second half is the load-bearing assumption of the whole design and has not yet been
> confirmed against a deployed environment.** If `revalidatePath` clears only the stored HTML
> and not the cached Sanity responses, pages re-render against unchanged data and the endpoint
> returns `{"revalidated":true}` while changing nothing — the same silent no-op that
> disqualified the segment timer. The first item in the verification checklist exists to
> settle it.

## The endpoint

`app/api/revalidate/route.js` exposes two authenticated entry points that share one purge:

- `POST` — the Sanity webhook. The signature timestamp is checked for freshness first, then
  the signature itself is verified via `parseBody` from `next-sanity/webhook`, which also waits
  ~3s for Content Lake consistency so the rebuild doesn't read data that is a moment out of
  date. Freshness is checked before the HMAC so a replay is rejected without paying that wait.
- `GET` — the Vercel cron job. Authenticated by `Authorization: Bearer $CRON_SECRET`, compared
  in constant time.

Both call `revalidatePath('/', 'layout')` plus `revalidatePath('/sitemap.xml')`, clearing
everything. The webhook payload is ignored on purpose: at a handful of publishes a month, a
full purge costs about one set of Sanity queries and cannot miss indirect dependencies — a
plant rendered inside another plant's "Growing Nearby" section, for example. Narrow this only
if the publishing rate rises enough to matter.

Unauthenticated requests are rejected with 401 and never reach the purge. This matters: an
open purge endpoint would let anyone force the whole site to re-render on demand.

**Replay window.** `@sanity/webhook` verifies the HMAC against the timestamp carried inside the
signature header but never compares it to the current time, so a captured request would
otherwise replay forever — and each replay spends Sanity quota. `MAX_SIGNATURE_AGE_MS` in the
route bounds that to 10 minutes. It is wide enough to absorb Sanity's delivery retries; if
legitimate deliveries ever start returning 401 because a retry arrived later than the window,
that constant is the knob. A determined attacker holding a captured request can still replay
within the window, so the endpoint is not a substitute for keeping the secret secret.

## Configuration

Two environment variables in Vercel, both required:

| Variable                   | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `SANITY_REVALIDATE_SECRET` | Shared with the Sanity webhook; verifies the signature  |
| `CRON_SECRET`              | Vercel sends this as a bearer token on cron invocations |

Neither has a safe default. If either is unset the corresponding handler returns 500 and
refuses to purge, rather than failing open.

**Check for an existing setup first.** `SANITY_REVALIDATE_SECRET` is already defined in the
project's local env file, which suggests a webhook may have been configured before. If one
exists, reuse its secret rather than generating a new value — a mismatch means every delivery
returns 401 and publishing silently stops clearing the cache, with the code and tests all
looking correct.

**Sanity webhook** (Manage → API → Webhooks):

- URL `https://ozarkedgewildflowers.com/api/revalidate`, method `POST`, dataset `production`
- Trigger on Create, Update, and Delete
- Secret: the same value as `SANITY_REVALIDATE_SECRET`
- No GROQ projection or type filter needed — the payload is ignored

**Cron** is declared in `vercel.json` and needs no dashboard setup beyond `CRON_SECRET`.
The schedule is `0 9 * * *`. **Vercel cron timezones are always UTC**, so that is 09:00 UTC —
roughly 3–4am Central, deliberately off-peak. Adjust with that in mind: `0 9` is not 9am local.

If `CRON_SECRET` is unset the handler returns 500 and the job fails silently every day; the
only signal is Vercel's cron invocation log, so check it after first deploy.

## Verifying a publish propagated

Work through this after the first deploy. The first three items are not routine checks — they
confirm assumptions the design rests on and that nothing so far has proven.

**1. Does purging actually refresh Sanity data?** (the load-bearing one)
Edit a plant's description in Studio and publish. Without redeploying, request that plant's
page and confirm the new text appears. If the old text persists, `revalidatePath` is clearing
only the stored HTML and the whole approach needs rethinking.

**2. Does `/sitemap.xml` get purged?**
`revalidatePath('/sitemap.xml')` addresses a metadata route generated by `app/sitemap.js`, and
it is unconfirmed that this path form matches the cache entry Next.js creates for it.
`revalidatePath` does not throw on a path with no matching entry, so a wrong form is a silent
no-op. Publish a new plant, then check that its URL appears in `sitemap.xml` without a deploy.

**3. Does the 404 page get purged?**
`app/not-found.js` fetches the `notFoundPage` document from Sanity and renders as the static
`/_not-found` route. It is unconfirmed that `revalidatePath('/', 'layout')` reaches it. Edit
that document, publish, and load any non-existent URL to see whether the new message appears.
If not, add an explicit purge for it.

**4. 404 recovery.** Request a URL for a document that is not yet published — this caches a 404. Publish the document, then request the URL again and confirm it now resolves.

**5. Forgeries are rejected.**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' -X POST https://ozarkedgewildflowers.com/api/revalidate
```

Expect `401`.

**Reading the cache state at any time:**

```bash
curl -sS -o /dev/null -D - https://ozarkedgewildflowers.com/native-plants | grep -i "x-vercel-cache\|age:"
```

`x-vercel-cache: HIT` with a climbing `age` means a stored copy is being served. After a
publish the next request should show `MISS` or `PRERENDER`, then `HIT` again with `age`
restarting. Sanity's webhook delivery log shows the response body — `{"revalidated":true}`
confirms the endpoint accepted the delivery, though note that is only proof it ran, not proof
the purge reached the data.

## Cost

The durable figures: Sanity's free tier allows **250,000 API requests/month**, and each full
page render costs roughly **5 queries** (about 3 from the page, 2 from the root layout). A full
purge is therefore ~370 queries at most — less in practice, because pages rebuild lazily, only
when someone visits them.

For current consumption against that ceiling, read the Sanity dashboard under the project's
Usage section rather than trusting a number written here; traffic is growing and any figure
committed to this file goes stale. Issue #326 records a dated measurement if you want a
historical reference point.

Two things worth knowing when sizing a change:

- Overage on the free tier is **blocked, not billed**. Exceeding the quota is an availability
  problem, not a surprise invoice, so leave real headroom.
- `<SanityLive />` opens a connection per visitor, making it the part of Sanity usage that
  scales with traffic. It, not the caching described here, is what to watch as the site grows.

## Related

- [Sanity Live + Draft Mode](SANITY_LIVE_DRAFT_MODE.md)
- Investigation and measurements: [issue #326](https://github.com/dandc11/ozarkedge-wildflowers/issues/326)
