# SEO Infrastructure Implementation Plan

**Branch:** `178-seo-content-author-tasks`  
**Prerequisite for:** Issue #181 (Google Search Console setup)  
**Related issues:** #177 (dev tasks), #178 (content author tasks)

---

## Context

Issue #177 specified that dev work was needed to wire Site Settings into the site's metadata. A code audit on 2026-03-07 found that this work was **never completed**:

- `GET_SITE_SETTINGS_QUERY` was defined in `sanity/lib/queries.js` but **never imported or used**
- `app/layout.js` exports a **static, hardcoded** `metadata` object — nothing from Sanity
- **Keywords** entered in Site Settings in Sanity Studio have no effect on the site
- `app/native-plants/page.js` is the **only page missing an OG image** in its metadata

Because Next.js falls back to the root layout's `description` when a page returns `description: undefined`, wiring Site Settings into the layout also provides the global fallback described in #178, task 3.

---

## What Already Works (No Changes Needed)

| Page | metaDescription | OG Image |
|------|----------------|----------|
| Home (`/`) | ✅ dynamic from Sanity | ✅ |
| About (`/about`) | ✅ dynamic from Sanity | ✅ |
| Plant list (`/native-plants`) | ✅ dynamic from Sanity | ❌ missing |
| Individual plant (`/native-plants/[slug]`) | ✅ dynamic from Sanity | ✅ (banner or preview fallback) |
| Season (`/season/[slug]`) | ✅ dynamic from Sanity | ✅ |
| `robots.js` | N/A | N/A — correct, no changes needed |
| `sitemap.js` | N/A | N/A — correct, no changes needed |

---

## Changes Required

### 1. Wire Site Settings into root layout — `app/layout.js`

**Problem:** `export const metadata = {...}` is a static export with hardcoded `description`. Site Settings `description` and `keywords` from Sanity are never used.

**Fix:** Replace `export const metadata` with `export async function generateMetadata()`. Fetch `GET_SITE_SETTINGS_QUERY` using the existing `sanityFetch` import (already present in the file). Keep all non-dynamic values (title template, metadataBase, openGraph, icons, manifest, viewport) unchanged.

```js
// BEFORE (app/layout.js, line 64)
export const metadata = {
  metadataBase: new URL('https://ozarkedgewildflowers.com'),
  title: {
    default: 'Ozarkedge Wildflowers | Native Plants of Arkansas',
    template: '%s | Ozarkedge Wildflowers',
  },
  description:
    'Discover native wildflowers of the Arkansas Ozarks — seasonal guides, plant profiles, and field photography from Ozarkedge.',
  openGraph: {
    siteName: 'Ozarkedge Wildflowers',
    locale: 'en_US',
    type: 'website',
  },
  // ... icons, manifest
}
```

```js
// AFTER
import { GET_MENU_ITEMS_QUERY, GET_SITE_SETTINGS_QUERY } from '../sanity/lib/queries'

export async function generateMetadata() {
  const { data: siteSettings } = await sanityFetch({
    query: GET_SITE_SETTINGS_QUERY,
    perspective: 'published',
    stega: false,
  })

  return {
    metadataBase: new URL('https://ozarkedgewildflowers.com'),
    title: {
      default: 'Ozarkedge Wildflowers | Native Plants of Arkansas',
      template: '%s | Ozarkedge Wildflowers',
    },
    description:
      siteSettings?.description ||
      'Discover native wildflowers of the Arkansas Ozarks — seasonal guides, plant profiles, and field photography from Ozarkedge.',
    keywords: siteSettings?.keywords ?? undefined,
    openGraph: {
      siteName: 'Ozarkedge Wildflowers',
      locale: 'en_US',
      type: 'website',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.manifest',
  }
}
```

**Note:** `export const viewport` remains unchanged — viewport is a separate export and does not need to become async.

**Effect:** Once Site Settings `description` is populated in Sanity Studio, it will:
- Serve as the layout-level description fallback for any page that returns `description: undefined`
- Be output as `<meta name="description">` on all pages without their own description
- Output `<meta name="keywords">` on all pages via `keywords` field (Next.js handles this automatically)

---

### 2. Add missing OG image to plant list page — `app/native-plants/page.js`

**Problem:** `generateMetadata()` returns no `og:image`. All other pages have one. `GET_PLANT_LIST_PAGE_DATA_QUERY` already fetches `mainImage` with `lqip`/`palette` — it just isn't used in metadata.

**Fix:** Import `urlForImage` and add OG image derivation, matching the pattern in other pages.

```js
// BEFORE (app/native-plants/page.js)
import {
  GET_NATIVE_PLANT_LIST_DATA_QUERY,
  GET_PLANT_LIST_PAGE_DATA_QUERY,
} from '../../sanity/lib/queries'
import { IMG_SIZES } from '../../utilities/constants'
import { sanityFetch } from '../../sanity/lib/sanity.live'

export async function generateMetadata() {
  const { data } = await sanityFetch({
    query: GET_PLANT_LIST_PAGE_DATA_QUERY,
    stega: false,
  })
  const pageData = data?.[0] ?? null
  const title = stegaClean(pageData?.pageTitle) || 'Native Wildflowers at Ozarkedge'
  const description = stegaClean(pageData?.metaDescription) || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
```

```js
// AFTER
import { urlForImage } from '../../sanity/lib/sanity.image'

export async function generateMetadata() {
  const { data } = await sanityFetch({
    query: GET_PLANT_LIST_PAGE_DATA_QUERY,
    stega: false,
  })
  const pageData = data?.[0] ?? null
  const title = stegaClean(pageData?.pageTitle) || 'Native Wildflowers at Ozarkedge'
  const description = stegaClean(pageData?.metaDescription) || undefined
  const ogImage = pageData?.mainImage
    ? urlForImage(pageData.mainImage, { width: 1200, height: 630 })?.url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}
```

---

## No Changes Needed

- **`sanity/lib/queries.js`** — `GET_SITE_SETTINGS_QUERY` already exists and is correct
- **Individual page `generateMetadata()` functions** — all correctly use page-level `metaDescription`; Next.js layout inheritance handles the fallback automatically
- **`app/robots.js`**, **`app/sitemap.js`** — both correct

---

## Verification Steps

After implementing:

1. Run `npm run build` — confirm no errors in metadata pipeline
2. Run `npm run dev` and check DevTools `<head>` on:
   - `/` — `<meta name="description">` from landing page; `<meta name="keywords">` from Site Settings
   - `/native-plants` — `<meta name="description">`, `og:image` now present
   - `/native-plants/[any-slug]` — plant-specific description
   - `/season/[any-slug]` — season-specific description
   - Any page whose Sanity `metaDescription` is empty — should fall back to Site Settings description
3. Validate OG tags with [opengraph.xyz](https://www.opengraph.xyz) or similar tool

---

## Out of Scope for This Branch

The following likely belong to issue #181 and should **not** be added here:

- Structured data / JSON-LD (schema.org `@type: WebSite`, `@type: Article`, etc.)
- Canonical URL tags
- `twitter:card` / Twitter/X metadata
- Per-page `robots` directives beyond the global `robots.js`
- Any Sanity content changes
