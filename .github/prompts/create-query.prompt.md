---
description: 'Create a new GROQ query in queries.js with proper fragments and naming'
agent: agent
tools:
  - search/codebase
  - edit/editFiles
---

# Create GROQ Query

Create a new centralized GROQ query following project conventions.

## Instructions

Follow the conventions defined in:

- [Sanity code instructions](../instructions/sanity-code.instructions.md)

## Steps

1. Read `sanity/lib/queries.js` and `sanity/lib/queryFragments.js` to understand current patterns.
2. Check if an existing query already covers the need (or can be extended).
3. Create the query in `sanity/lib/queries.js` using:
   - `defineQuery()` from `next-sanity`
   - `GET_<RESOURCE>_QUERY` naming convention
   - Fragment functions from `queryFragments.js` where applicable
4. Always include LQIP/palette metadata for image fields:
   ```groq
   "palette": asset->metadata.palette,
   "lqip": asset->metadata.lqip,
   ```
5. Use clear prefixed names when dereferencing references.
6. If a new reusable fragment is needed, add it to `queryFragments.js`.
