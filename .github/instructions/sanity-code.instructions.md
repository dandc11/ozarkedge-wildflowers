---
name: 'Sanity Code'
description: 'GROQ query conventions, Sanity schema patterns, stega cleaning rules, and query fragment usage'
applyTo: 'sanity/**,schemas/**'
---

# Sanity Code Conventions

## GROQ Queries

- All queries go in [sanity/lib/queries.js](../../sanity/lib/queries.js). Never write queries inline in components or pages.
- Naming: `GET_<RESOURCE>_QUERY` (e.g., `GET_MENU_ITEMS_QUERY`). Use `defineQuery()` from `next-sanity`.
- Use reusable fragment functions from [sanity/lib/queryFragments.js](../../sanity/lib/queryFragments.js) (`figureFields`, `imageCollectionFields`, etc.).

### Dereferencing Pattern

Project fields with clear, prefixed names when dereferencing:

```groq
"linkData": link->{
  "linkId": _id,
  "linkType": _type,
  "linkSlug": slug.current,
  "linkTitle": title
}
```

### Polymorphic Array Projection

Use conditional projection for portable text with multiple block types:

```groq
body[]{
  _type == "figure" => ${figureFields()},
  _type == "imageCollection" => ${imageCollectionFields()},
  _type == "block" => @
}
```

### Image Metadata — Required

All image queries **must** include LQIP and palette data:

```groq
mainImage {
  ...,
  "palette": asset->metadata.palette,
  "lqip": asset->metadata.lqip,
}
```

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

## Schema Conventions

- Use `defineField` and `defineType` from Sanity v3+.
- Use `defineField` and `defineType` from Sanity v3+.
- Check current Sanity version in [`package.json`](../../package.json) before suggesting API patterns.
