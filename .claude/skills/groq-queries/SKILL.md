---
name: groq-queries
description: Conventions for writing and extending GROQ queries in this project — naming, fragments, dereferencing, polymorphic Portable Text projection, mandatory image metadata, and stega cleaning rules. Use when creating a new query, extending an existing one, or reviewing query code.
---

# GROQ Query Conventions

Centralized guidance for writing GROQ queries in the ozarkedge-wildflowers project. Consolidates the project's Sanity code conventions with a step-by-step workflow for adding a new query.

## Core Rules

- All queries live in [sanity/lib/queries.js](../../../sanity/lib/queries.js). Never write GROQ inline in components or pages.
- Fetch with `sanityFetch` from [sanity/lib/sanity.live.js](../../../sanity/lib/sanity.live.js) — never bare `client.fetch`.
- Naming: `GET_<RESOURCE>_QUERY` (e.g. `GET_MENU_ITEMS_QUERY`). Define with `defineQuery()` from `next-sanity`.
- Reuse fragment functions from [sanity/lib/queryFragments.js](../../../sanity/lib/queryFragments.js) (`figureFields`, `imageCollectionFields`, `imageFields`, etc.) instead of duplicating projections.

## Workflow: Adding a New Query

1. Read `sanity/lib/queries.js` and `sanity/lib/queryFragments.js` to understand current patterns.
2. Check if an existing query already covers the need, or can be extended.
3. Write the query using `defineQuery()`, the `GET_<RESOURCE>_QUERY` naming convention, and fragment functions where applicable.
4. Always include LQIP/palette metadata for image fields (see below) — this is enforced, not optional.
5. Use clear, prefixed names when dereferencing references (see pattern below).
6. If a new reusable fragment is needed, add it to `queryFragments.js` rather than inlining a duplicate projection.

## Dereferencing Pattern

Project fields with clear, prefixed names when dereferencing:

```groq
"linkData": link->{
  "linkId": _id,
  "linkType": _type,
  "linkSlug": slug.current,
  "linkTitle": title
}
```

## Polymorphic Array Projection

Use conditional projection for Portable Text with multiple block types:

```groq
body[]{
  _type == "figure" => ${figureFields()},
  _type == "imageCollection" => ${imageCollectionFields()},
  _type == "block" => @
}
```

## Image Metadata — Required

All image queries **must** include LQIP and palette data:

```groq
mainImage {
  ...,
  "palette": asset->metadata.palette,
  "lqip": asset->metadata.lqip,
}
```

See the `image-components` skill for the full fragment reference (`imageFields`, `figureFields`, `mainImageFields`).

## Stega Cleaning

`stegaClean()` removes Visual Editing markers. Clean only non-editable DOM usage — Visual Editing needs markers in user-visible text.

**DO clean**: CSS class names, URL segments, data attributes, conditional logic, array keys.
**DO NOT clean**: headings, body text, captions, titles — any user-visible text.

```javascript
// ✅ Clean for CSS class
className={stegaClean(menuButtonColor)}
// ❌ Don't clean display text
<h1>{title}</h1>
```

## Schema Awareness

- Use `defineField` and `defineType` from Sanity v5+ when a query change requires a schema change.
- Check the current Sanity version in [package.json](../../../package.json) before assuming API behavior.
- If the query targets a new or changed schema shape, consult the `sanity-migrations` skill for backfill/migration requirements.

## Reference

See [docs/PLANT_RELATIONSHIPS_QUERIES.md](../../../docs/PLANT_RELATIONSHIPS_QUERIES.md) for the nearby-plants/botanical-name auto-linking query patterns (only relevant when working on plant relationship features).
