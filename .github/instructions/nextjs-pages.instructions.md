---
name: 'Next.js Pages'
description: 'Next.js App Router page patterns: sanityFetch, generateStaticParams, notFound, draftMode, Suspense'
applyTo: 'app/**'
---

# Next.js Page Conventions

## Data Fetching

Always use `sanityFetch` from `sanity/lib/sanity.live.js` — never bare `client.fetch`:

```javascript
import { draftMode } from 'next/headers'
import { sanityFetch } from '@/sanity/lib/sanity.live'
import { GET_PAGE_QUERY } from '@/sanity/lib/queries'

const { isEnabled: isDraftMode } = await draftMode()
const { data } = await sanityFetch({
  query: GET_PAGE_QUERY,
  perspective: isDraftMode ? 'previewDrafts' : 'published',
  stega: isDraftMode,
})
```

## Missing Data

Check `_id` and call `notFound()`:

```javascript
import { notFound } from 'next/navigation'
if (!data?._id) notFound()
```

Fallback pattern for multi-doc queries: `const data = queryResponse?.data?.[0] ?? null`

## Dynamic Routes

Use `generateStaticParams` with published perspective — never `previewDrafts` or stega:

```javascript
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: GET_ALL_PATHS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return data
}
```

## Server vs Client Components

- All pages are React Server Components by default.
- Add `'use client'` only when hooks or browser APIs are required.
- Wrap components that may cause loading delays in Suspense boundaries.
- Prefer URL search params for filter state over client state when appropriate.
