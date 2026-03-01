---
description: 'Scaffold a new page route with GROQ query, page component, CSS, and generateStaticParams'
agent: agent
tools:
  - search/codebase
  - edit/createFile
  - edit/editFiles
---

# Add Page

Scaffold everything needed for a new page route.

## Instructions

Follow the conventions defined in:

- [Next.js page instructions](../instructions/nextjs-pages.instructions.md)
- [Sanity code instructions](../instructions/sanity-code.instructions.md)
- [Component instructions](../instructions/components.instructions.md)
- [CSS instructions](../instructions/css.instructions.md)

## Reference pages

Study these existing pages as patterns to follow:

- `app/native-plants/[slug]/page.js` — dynamic page with `generateStaticParams`, SEO metadata, image grids
- `app/season/[slug]/page.js` — similar dynamic page with related-content sections
- `app/about/page.js` — static page with Portable Text content

## Steps

1. Study the reference pages above to understand the established patterns.
2. Create the GROQ query in `sanity/lib/queries.js` with `GET_*_QUERY` naming. Include image metadata (lqip, palette).
3. Create the page component in the appropriate `app/` route directory:
   - Use `sanityFetch` with `draftMode()` for perspective/stega
   - For dynamic routes: implement `generateStaticParams` with `perspective: 'published'` and `stega: false`
   - Handle missing data with `notFound()`
   - Export `generateMetadata` for SEO
4. Create page-specific CSS in `styles/pages/`.
5. Use `ResponsiveImage` / `InteractiveImage` for images.
6. Offer to write tests.
