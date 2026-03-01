---
name: 'Sanity Mock Data'
description: 'Guidelines for creating and maintaining Sanity mock data in test fixtures'
applyTo: 'tests/mocks/**'
---

# Sanity Mock Data Guidelines

## Reuse First

Always check `tests/mocks/sanity-mocks.js` for existing mocks before creating new ones. If close, extend locally: `{ ...existingMock, newField }`.

## Source of Truth

Before creating new mock shapes:

1. Inspect the relevant GROQ query in `sanity/lib/queries.js` to see which fields are projected.
2. Cross-reference schema in `schemas/documents/` and `schemas/objects/` for field names and types.
3. Include only fields consumed by the code under test.

## Mock Shape Rules

- Keep mocks lean — omit unused arrays, rich text, or nested objects.
- Arrays: 1–2 items usually suffice; add a third only when order/indexing matters.
- Images: include `asset._ref`, `alt`, and `lqip`/`palette` when the component uses them. Use realistic ref format: `image-<hash>-<dimensions>-jpg`.
- Portable Text: use existing exported mocks where possible. Mocks must be arrays of blocks — never nest block nodes inside block children.

## Adding New Exports

Add to `sanity-mocks.js` only if: (a) 2+ test files will use it, (b) it reduces >10 lines of duplication, or (c) it captures a complex edge case that will recur. Add a comment describing primary usage.

## Updating Mocks

- Clone, don't mutate: `{ ...mockObj, newField }`.
- Annotate structural changes: `// Updated to match schema change (2026-03)`.

## Error / Edge Scenarios

- Use consistent scenario keys: `plants`, `single-plant`, `seasons`, `empty`, `error`, `loading`.
- For error paths: `mockRejectedValue(new Error('...'))`.

## Quick Checklist

- [ ] Searched `sanity-mocks.js` — no suitable existing mock fits
- [ ] Verified required fields via query + schema
- [ ] Limited to fields actually consumed
- [ ] Included image metadata if needed (alt, asset.\_ref, lqip/palette)
- [ ] Named export clearly and documented purpose
