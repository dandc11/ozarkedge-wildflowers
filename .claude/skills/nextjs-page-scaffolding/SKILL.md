---
name: nextjs-page-scaffolding
description: Workflow and conventions for scaffolding a new Next.js App Router page in this project — GROQ query, sanityFetch/draftMode/generateStaticParams/notFound, page CSS, and generateMetadata. Use when adding a new page route or reviewing one.
---

# Next.js Page Scaffolding

Workflow and conventions for adding a new page route in the ozarkedge-wildflowers project. Ports `.github/instructions/nextjs-pages.instructions.md` and `.github/prompts/add-page.prompt.md`. Pairs with the `groq-queries` skill (query authoring) and `component-styling` skill (page/component CSS).

## Reference Pages

Study these existing pages as patterns before scaffolding a new one:

- `app/native-plants/[slug]/page.js` — dynamic page with `generateStaticParams`, SEO metadata, image grids
- `app/season/[slug]/page.js` — similar dynamic page with related-content sections
- `app/about/page.js` — static page with Portable Text content

## Steps

1. Study the reference pages above to understand the established patterns before writing new code.
2. Create the GROQ query in `sanity/lib/queries.js` following the `GET_*_QUERY` naming convention from the `groq-queries` skill. Include image metadata (`lqip`, `palette`) on every image field.
3. Create the page component in the appropriate `app/` route directory (see "Data Fetching", "Missing Data", and "Dynamic Routes" below).
4. Create page-specific CSS in `styles/pages/{page-name}.css` per the `component-styling` skill — never inline styles.
5. Use `ResponsiveImage` / `InteractiveImage` for images (never raw Next.js `<Image>`) — see the `image-components` skill.
6. Export `generateMetadata` for SEO.
7. Offer to write tests for the new page (see the `testing` skill).

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

Use `generateStaticParams` with the published perspective — never `previewDrafts` or stega, since this runs at build time with no draft-mode context:

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

## Server vs. Client Components

- All pages are React Server Components by default.
- Add `'use client'` only when hooks or browser APIs are required.
- Wrap components that may cause loading delays in Suspense boundaries.
- Prefer URL search params for filter state over client state when appropriate.
