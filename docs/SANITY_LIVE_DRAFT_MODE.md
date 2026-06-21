# Sanity Live + Draft Mode Pattern

To keep local dev fast and still give authors real-time previews in Studio Presentation, this project uses the following pattern:

- Default client to published with stega disabled (sanity/lib/sanity.client.js):
  - `perspective: 'published'`
  - `stega: { enabled: false, studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL }`
- Enable live updates and steganography only when Draft Mode is enabled:
  - In `app/layout.js`, mount `<SanityLive />` in Production always, and in Development only when Draft Mode is on. Mount `<VisualEditing />` only when Draft Mode is on.
  - For each `sanityFetch` call, pass `perspective` and `stega` based on Draft Mode.

Example per-request fetch

```js
import { draftMode } from 'next/headers'
import { sanityFetch } from '../../sanity/lib/sanity.live'

export default async function Page() {
  const { isEnabled: isDraftMode } = await draftMode()
  const { data } = await sanityFetch({
    query: GET_SOME_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  // ...
}
```

Visual Editing notes

- Do NOT run `stegaClean` on user-visible text (titles, headings, body). Keep markers for inline editing.
- Use `stegaClean` only for non-visible/class/URL/attribute use.
- Always include `_id` in page-level queries for stable React keys and Visual Editing targeting.

Dev workflow

- Normal browsing (fast): Draft Mode off (no `<SanityLive />`, published perspective, stega disabled).
- Preview/drafts: enable Draft Mode via Studio Presentation (at https://ozarkedgewildflowers.sanity.studio) or `/api/draft-mode/enable`.
- Exit preview: use the DisableDraftMode UI or `/api/draft-mode/disable`.
- Automated/headless browser tooling cannot enable Draft Mode itself: `/api/draft-mode/enable` requires a signed secret from `.env.local`, which should never be read or exposed to such tooling. As a result, unpublished content is invisible to automated preview/screenshot tools — verify draft-only UI changes with a screenshot from an actual logged-in browser session instead.

Mounting guidance

- Always-on live (mount everywhere) maximizes immediacy but can cause dev churn.
- Prod + Draft Mode (recommended): live in prod for quick user-facing updates; in dev, live only during Draft Mode to keep local browsing fast.
- Draft Mode only: no live in prod; rely on webhooks for revalidation.
