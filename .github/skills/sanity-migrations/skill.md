---
name: sanity-migrations
description: Expert guidance for creating, running, and managing Sanity.io content and schema migrations. Use when planning or executing migrations, changing schemas, validating documents, or migrating content between formats. Includes safety checklists, GROQ filtering patterns, atomic update strategies, idempotent migration patterns, and production workflow best practices.
---

# Sanity Migrations Expert

This skill provides comprehensive guidance for safely creating and executing Sanity.io content and schema migrations in the ozarkedge-wildflowers project.

## When to Use This Skill

Use this skill when:

- Planning or creating a new Sanity migration
- Changing document schemas or field types
- Migrating content between formats (e.g., string to Portable Text, reference to array)
- Validating documents against schema changes
- Running migrations on production datasets
- Troubleshooting migration issues
- Updating content models without breaking existing data

## Official Sanity Documentation

Always consult the latest documentation for updates:

- [Migrating Schema and Content](https://www.sanity.io/docs/content-lake/schema-and-content-migrations) - Main migration guide
- [Content Migration Cheat Sheet](https://www.sanity.io/docs/content-lake/content-migration-cheatsheet) - Common migration patterns
- [Schema Migration Principles](https://www.sanity.io/docs/content-lake/important-considerations-for-schema-and-content-migrations) - Production considerations
- [CLI Migration Reference](https://www.sanity.io/docs/cli-reference/cli-migrations) - CLI command reference
- [Schema Change Management Course](https://www.sanity.io/learn/course/handling-schema-changes-confidently) - Interactive learning

## Core Principles

1. **Safety First**: Always back up datasets before migrations
2. **Dry-Run First**: Never skip the dry-run step
3. **Atomic Updates**: Use whole-field updates to avoid corrupting arrays
4. **Idempotent**: Make migrations safe to re-run when possible
5. **Validate**: Check results in Studio, Vision, and frontend

## Migration Workflow

### Creating a Migration

1. **Create migration scaffold**:

   ```bash
   sanity migrations create
   ```

   This creates `/migrations/<migration-id>/index.ts`

2. **File structure options**:
   - Single file: `migrations/my-migration.ts`
   - Folder with helpers: `migrations/my-migration/index.ts`

### Running Migrations

1. **List available migrations**:

   ```bash
   sanity migrations list
   ```

2. **Always dry-run first** (default behavior):

   ```bash
   sanity migrations run <migration-id>
   ```

   Review the output carefully before proceeding.

3. **Execute the migration**:

   ```bash
   sanity migrations run <migration-id> --no-dry-run
   ```

4. **Useful flags**:
   - `--dataset <name>` - Target specific dataset
   - `--concurrency <n>` - Control parallel requests (1-10, default 6)
   - `--no-dry-run` - Execute the migration (default is dry-run)
   - `--no-confirm` - Skip confirmation prompt before executing
   - `--no-progress` - Hide progress bar, show detailed mutation logs
   - `--api-version <version>` - Override API version (defaults to v2024-01-29)
   - `--from-export=<file.tar.gz>` - Dry-run against export file

### Safety Checklist (Every Migration)

✅ **Before running**:

1. Back up the dataset: `sanity dataset export`
2. Run `sanity migrations list` to confirm migration ID
3. Run dry-run and review all patches
4. Verify GROQ filter targets only intended documents
5. Test on staging/development dataset first (for production)

✅ **After running**:

1. Spot-check documents in Sanity Studio
2. Verify counts and data in Vision Tool
3. Test frontend rendering
4. Validate with `sanity documents validate`

## GROQ Filtering Best Practices

### Exclude Drafts (Published Only)

```groq
_type == "nativePlant" && !(_id in path("drafts.**"))
```

### Common Filter Additions

```groq
// Require field exists
defined(fieldName)

// Require array has matching elements
count(arrayField[predicate]) > 0

// Combined example
_type == "post" && !(_id in path("drafts.**")) && defined(oldField)
```

## Migration Patterns

### Understanding node and path

Migration functions receive `node` (value) and `path` (location):

```ts
migrate: {
  string(node, path, context) {
    // node: "My Title"
    // path: ['title']

    // For nested: "my-slug"
    // path: ['slug', 'current']
  }
}
```

**Available migration functions**:

- `document(doc, context)` - Each matching document
- `node(node, path, context)` - Every value
- `object(node, path, context)` - Every object
- `array(node, path, context)` - Every array
- `string(node, path, context)` - Every string
- `number(node, path, context)` - Every number
- `boolean(node, path, context)` - Every boolean
- `null(node, path, context)` - Every null

**Note**: Migration tooling auto-generates `_key` values for array items.

### Atomic Array Updates

❌ **Don't patch by index** (can corrupt data):

```ts
// BAD - indices can shift
at(['items', 0], set(newValue))
```

✅ **Do rebuild entire array**:

```ts
document(doc) {
  const items = doc.items || []
  const newItems = items.map(item => transformItem(item))
  return patch(doc._id, [at('items', set(newItems))])
}
```

### Idempotent Migrations

Make migrations safe to re-run:

```ts
// Idempotent example
at('name', set(person.name.toUpperCase()))

// Non-idempotent (runs multiple times = different results)
at('members', insert({ name: 'Someone' }))
```

**Using idempotence markers**:

```ts
const idempotenceKey = 'migration-xyz-2025-01'

export default defineMigration({
  title: 'Safe migration with marker',
  migrate: {
    document(doc) {
      if ((doc?._migrations || []).includes(idempotenceKey)) {
        return // Skip already migrated
      }
      return [
        // ... migration patches
        at('_migrations', setIfMissing([])),
        at('_migrations', insert(idempotenceKey)),
      ]
    },
  },
})
```

### Memory-Efficient Async Generators

For large datasets (thousands of documents):

```ts
import { defineMigration, patch, at, setIfMissing } from 'sanity/migrate'

export default defineMigration({
  title: 'Process documents efficiently',
  async *migrate(documents, context) {
    for await (const doc of documents()) {
      yield patch(doc._id, [at('field', setIfMissing('default'))])
    }
  },
})
```

### Using context.client for Enrichment

Fetch additional data during migrations:

```ts
migrate: {
  async document(doc, context) {
    const data = await context.client.fetch(
      `*[_id == $id][0]{ ... }`,
      { id: doc.ref._ref }
    )

    // Use published perspective
    const publishedClient = context.client.withConfig({
      apiVersion: '2024-10-28',
      perspective: 'published'
    })

    return at('enrichedField', set(data.value))
  }
}
```

### Find and Update Deeply Nested Objects

Use the `node()` handler to visit every value in a document tree. Return a mutation to transform matching nodes:

```ts
import { defineMigration, set } from 'sanity/migrate'

export default defineMigration({
  title: 'Add tracking field to all link objects',
  migrate: {
    node(node, path, context) {
      if (node._type === 'link') {
        return set({ ...node, tracking: true })
      }
    },
  },
})
```

The `node()` handler automatically traverses the entire document, including Portable Text blocks, arrays, and nested objects. Use `object()` to visit only object nodes, or `array()` for array nodes.

### Using extractWithPath for Document Context

When you need access to document-level fields while updating nested objects, use `extractWithPath` from `@sanity/mutator` with the `document()` handler:

```ts
import { extractWithPath } from '@sanity/mutator'
import { at, defineMigration, set } from 'sanity/migrate'

export default defineMigration({
  title: 'Update nested objects using document context',
  migrate: {
    document(doc) {
      // '..' is JSONMatch recursive descent — matches at any depth
      const matches = extractWithPath('..[_type=="plantName"]', doc)
      if (matches.length === 0) return

      return matches.map(({ path, value }) =>
        at(
          path,
          set({
            ...value,
            source: doc.title,
          }),
        ),
      )
    },
  },
})
```

Use `node()` when you only need the matched node itself. Use `extractWithPath` with `document()` when you need to reference other fields from the parent document. See [JSONMatch documentation](https://www.sanity.io/docs/content-lake/json-match) for path expression syntax.

### Migrate Using Content Releases

Run migrations into a content release instead of writing directly to existing documents. This decouples the migration from the live dataset:

```ts
import { defineMigration, createOrReplace } from 'sanity/migrate'

const RELEASE_ID = 'release-id'

export default defineMigration({
  title: 'Content release migration',
  documentTypes: ['nativePlant'],
  // Only run on published documents, skip versions
  filter: `!(_id in path('versions.**'))`,
  migrate: {
    async document(doc, context) {
      const newDoc = {
        _type: 'nativePlant',
        _id: `versions.${RELEASE_ID}.${doc._id}`,
        // Carry over and transform any fields
        ...doc,
        newField: 'value',
      }
      return [createOrReplace(newDoc)]
    },
  },
})
```

Create the release first via the Content Releases API, then use the release name as `RELEASE_ID`. See [Content Releases API docs](https://www.sanity.io/docs/apis-and-sdks/content-releases-api).

## Schema Management

### Deprecating Fields Before Migration

Mark fields as deprecated to guide editors:

```ts
import { defineField } from 'sanity'

export default defineField({
  name: 'oldFieldName',
  type: 'string',
  deprecated: {
    reason: 'Use newFieldName instead.',
  },
  readOnly: true, // Prevent further edits
})
```

This shows visual warnings in Studio and GraphQL API.

### Immutable Fields (Cannot Migrate)

These fields **cannot be changed** via migrations:

- `_type`
- `_id`
- `_createdAt`
- `_updatedAt`
- `_rev`

To change `_type` or `_id`:

1. Export dataset
2. Modify NDJSON file directly
3. Update all references to new `_id` values
4. Delete old documents from dataset
5. Import modified export

See [Migrate a document type guide](https://www.sanity.io/docs/content-lake/content-migration-cheatsheet#0d1a7bcd5f91).

## Document Validation

Check validation status across dataset:

```bash
# Validate against schema
sanity documents validate

# Output to JSON for parsing
sanity documents validate -y --format ndjson > validations.ndjson

# Find errors with GROQ CLI
cat validations.ndjson | groq -n "*[level == 'error'].intentUrl"

# Validate against export file
sanity documents validate --file export.tar.gz
```

Use before migrations to identify affected documents and after to verify success.

## Production Migration Workflow

For production projects, follow this 12-step workflow:

1. **Export/backup** - `sanity dataset export` or enable backups
2. **Clone to staging** - Test on non-production dataset
3. **Update schema** - Add `deprecated` markers with clear reasons
4. **Validate** - Run `sanity documents validate`
5. **Create migration** - `sanity migrations create`
6. **Dry-run in staging** - Review all patches
7. **Execute in staging** - Run with `--no-dry-run`
8. **Update app code** - Write defensive code supporting both models
9. **Test thoroughly** - Verify in branch/PR deployments
10. **Onboard stakeholders** - Let content team test new experience
11. **Merge & run production** - Execute migration on production
12. **Cleanup code** - Remove old content model support

**Defensive GROQ pattern**:

```groq
"oldFieldName": coalesce(newFieldName, oldFieldName)
```

**Important**: Notify editors before running migrations—they may be actively editing.

## Rate Limits

Migrations follow standard [Sanity rate limits](https://www.sanity.io/docs/content-lake/technical-limits#k50838b4c19db):

- Default concurrency: 6 parallel requests
- Adjust with `--concurrency` flag (1-10)
- Lower concurrency to avoid rate limit issues

## Common Migration Patterns

See [Content Migration Cheat Sheet](https://www.sanity.io/docs/content-lake/content-migration-cheatsheet) for copy-paste examples:

- Rename a field
- Add field with default value
- Convert reference to array of references
- Convert string to Portable Text
- Convert Portable Text to plain text
- Convert string to localized i18n array
- Migrate inline objects to references
- Deduplicate arrays
- Delete documents by type
- Sort array by reference property
- Backfill missing initial values
- Shift Portable Text headings
- Correct heading nesting
- Find and update deeply nested objects
- Convert URLs to internal references
- Migrate using content releases

## Helper Functions Reference

### From `sanity/migrate`:

**Patch creators**:

- `patch(documentId, operations)` - Create document patch
- `createIfNotExists(document)` - Create if missing
- `createOrReplace(document)` - Create or overwrite
- `del(documentId)` - Delete document (also exported as `delete_`)

**Operations** (use with `at()`):

- `set(value)` - Set field value
- `setIfMissing(value)` - Set only if doesn't exist
- `unset()` - Remove field
- `insert(value, position)` - Insert into array
- `append(value)` - Add to array end
- `prepend(value)` - Add to array start
- `replace(items, {_key})` - Replace array items

**Path helpers** (from `'sanity'`, not `'sanity/migrate'`):

- `pathsAreEqual(path1, path2)` - Compare paths
- `stringToPath(string)` - Convert to path array

**Path helpers** (from `'sanity/migrate'`):

- `at(path, operation)` - Target specific field

**Document tree traversal** (from `'@sanity/mutator'`):

- `extractWithPath(pattern, document)` - Find nested values using JSONMatch patterns

**Migration structure**:

- `defineMigration({ title, documentTypes, filter, migrate })`

See [TypeScript API reference](https://www.sanity.io/docs/reference/api/sanity/migrate/append).

## Troubleshooting

### Logging Best Practices

- Log counts, skipped items, document IDs
- Use `--no-progress` flag to hide the progress bar and see detailed mutation output
- Be explicit about skip conditions

### Webhook Considerations

- Webhooks may fire during migrations
- Consider pausing webhooks before large migrations
- Re-enable after completion

### NPM Scripts Pattern

```json
{
  "scripts": {
    "migrate:field-rename:dry-run": "sanity migrations run field-rename",
    "migrate:field-rename": "sanity migrations run field-rename --no-dry-run"
  }
}
```

## Project-Specific Notes (Ozarkedge Wildflowers)

- Migrations live in `/migrations/<migration-id>/index.ts`
- Always exclude drafts for published content: `!(_id in path("drafts.**"))`
- Test migrations on development dataset before production
- Document all migrations in version control
- Prior migration examples in `/migrations/`: `convert-nearby-plants/`, `cleanup-nearby-plants-duplicates/`, `rename-pagebodyportabletext-objects/`

## Remember

1. **Never skip dry-run** - It's your safety net
2. **Always backup first** - Datasets cannot be easily restored
3. **Test in staging** - Production migrations are high-stakes
4. **Verify thoroughly** - Check Studio, Vision Tool, and frontend
5. **Communicate with team** - Editors need to know about changes

When in doubt, consult the [official documentation](https://www.sanity.io/docs/content-lake/schema-and-content-migrations) for the latest patterns and best practices.
