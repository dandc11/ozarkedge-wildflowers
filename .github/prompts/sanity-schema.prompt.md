---
description: 'Create or modify a Sanity schema using Sanity Expert conventions'
agent: Sanity Expert
tools:
  - search/codebase
  - edit/createFile
  - edit/editFiles
  - web/fetch
---

# Create/Modify Sanity Schema

Create or modify a Sanity document or object schema.

## Instructions

Follow the conventions defined in:

- [Sanity code instructions](../instructions/sanity-code.instructions.md)

## Steps

1. Check current Sanity version in `package.json` to ensure API compatibility.
2. Review existing schemas in `schemas/documents/` and `schemas/objects/` for patterns.
3. Use `defineField` and `defineType` from Sanity v5+.
4. Add proper validation rules and preview configurations.
5. Register the new schema type in `schemas/schema.js`.
6. If the schema requires a GROQ query, create it in `sanity/lib/queries.js`.
7. If this is a schema change on existing content, consult [docs/SANITY_MIGRATIONS.md](../../docs/SANITY_MIGRATIONS.md) for migration requirements.
