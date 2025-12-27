# Sanity Migrations Guide (Ozarkedge Wildflowers)

This guide captures the repo-specific migration workflow and lessons learned from past migrations in this project.

## Goals

- Make migrations **safe**, **repeatable**, and **reviewable**
- Default to **dry-run first**, always
- Avoid corrupting arrays/portable content by using **atomic, whole-field updates**

## Where migrations live

- Create migrations in: `/migrations/<migration-id>/index.ts`
- Run them by migration id (the folder name): `<migration-id>`

Sanity expects the migration file to default-export a migration.

## How to create a migration

Use the CLI scaffold:

- `sanity migration create`

This creates a new folder under `/migrations/` with an `index.ts` you can edit.

## How to run migrations (critical)

### List available migrations

- `sanity migration list`

### Dry-run (default)

Migrations run in **dry mode by default**:

- `sanity migration run <migration-id>`

Dry-run prints the mutations it _would_ apply.

### Execute (writes to Content Lake)

To actually mutate data:

- `sanity migration run <migration-id> --no-dry-run`

### Helpful flags

- `--dataset <name>` / `--project <id>`: target a non-default dataset/project.
- `--concurrency <n>`: run multiple mutation requests in parallel.
- `--no-confirm`: skips the safety prompt (use only when you’re certain).
- `--no-progress`: shows raw console output more clearly.

### Dry-run from a dataset export

You can run a dry-run using a local export file as the _source_:

- `sanity migration run <migration-id> --from-export=<export.tar.gz>`

Note: executing (`--no-dry-run`) **from an export file** is not supported.

## Safety checklist (do this every time)

1. **Back up the dataset** (export) before running anything.
2. Run `sanity migration list` and confirm the id.
3. Run `sanity migration run <id>` (dry-run) and review output.
4. Verify your GROQ filter targets only what you intend.
5. Only then run with `--no-dry-run`.
6. After execution, verify results in:
   - Sanity Studio (spot-check docs)
   - Vision queries (counts, sanity checks)
   - Frontend rendering

## Filtering: published vs drafts

If you intend to migrate **published** documents only, exclude drafts:

```groq
_type == "<documentType>" && !(_id in path("drafts.**"))
```

Common additions:

- Require a field to exist:

```groq
defined(<fieldName>)
```

- Require at least one matching array element:

```groq
count(<fieldName>[<predicate>]) > 0
```

## Safe mutation patterns

### Prefer atomic replacement over index patching

Avoid patching array items by index while iterating. It’s easy to:

- shift indices mid-loop
- accidentally insert at the wrong location
- corrupt the array

Recommended pattern:

1. Read existing array
2. Build a new array in memory
3. Replace the entire field with a single `set()`

Example (from this repo’s approach):

```ts
import {at, defineMigration, patch, set} from 'sanity/migrate'

export default defineMigration({
  title: 'Example: rebuild array safely',
  documentTypes: ['<documentType>'],
  filter: '_type == "<documentType>" && !(_id in path("drafts.**")) && defined(<fieldName>)',
  migrate: {
    document(doc) {
      const list = doc.<fieldName> || []
      const nextList = list.filter(Boolean)

      // Build nextList however you need…

      return patch(doc._id, [at('<fieldName>', set(nextList))])
    },
  },
})
```

### Make migrations idempotent (or plan cleanup)

Migrations can be run twice by mistake. Either:

- make the migration idempotent (safe to re-run), or
- write a cleanup migration that normalizes/deduplicates.

If you’re doing additive conversions, consider including a cleanup/normalization migration plan.

## Logging and troubleshooting

- Keep logs actionable: counts, skipped items, doc ids.
- If you need detailed logs during dry-run, consider `--no-progress`.
- Be explicit about skip conditions (ex: required value extraction failed) and count them.

## Webhooks note

During migrations, webhooks can remain active depending on your project configuration.
If your downstream systems shouldn’t receive mutation bursts, consider pausing them before execution and re-enabling afterward.

## Recommended npm scripts pattern

Add paired scripts:

- `migrate:<name>:dry-run`: runs `sanity migration run <id>`
- `migrate:<name>`: runs `sanity migration run <id> --no-dry-run`

This keeps execution explicit and reduces “oops” moments.
