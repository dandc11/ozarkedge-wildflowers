# fix-savanna-spelling

Corrects the `nativePlant.habitatType` picklist value **`Savannah`** (the Georgia
city) to **`Savanna`** (the habitat).

## Why

`habitatType` stores the literal string, and that stored string is what the site
renders and filters on:

- `components/PlantImageCard.js` joins the array straight onto the plant card.
- `components/PlantListGrid.js` (`getMatched`) does an exact string compare
  against the selected filter option.

So the schema and `HABITAT_OPTIONS` changes are not viable on their own. Without
this migration, plant cards keep reading "Savannah", filtering by "Savanna"
matches nothing, and Studio flags the stored value as outside the picklist.

The misspelling only ever existed in this one field. Body copy, image alt text,
captions, asset keywords, and the "Savanna Blazing Star" common name were all
already spelled correctly — this brings the picklist in line with content that
was already right.

## Scope

As of the 2026-08-10 dataset snapshot, 25 of 72 `nativePlant` documents carry
`Savannah`:

| Kind                                     | Count |
| ---------------------------------------- | ----- |
| Published                                | 22    |
| Drafts                                   | 2     |
| Content-release version (`agent-slYg28`) | 1     |

## Drafts and versions are intentionally included

This migration deliberately omits the `!(_id in path("drafts.**"))` filter that
`.claude/skills/sanity-migrations/SKILL.md` prescribes as the house default, and
likewise does not exclude `versions.**`.

Excluding them would look clean immediately and silently reintroduce "Savannah"
the moment that draft is published or that content release ships — with no
obvious cause months later. All three kinds are corrected in one pass.

## Running it

Dry-run is the default. Back up first, per
[docs/BACKUP_AND_ROLLBACK.md](../../docs/BACKUP_AND_ROLLBACK.md).

```bash
npm run sanity:backup                      # fresh export before touching prod
npm run migrate:savanna-spelling:dry-run   # review every patch
npm run migrate:savanna-spelling           # --no-dry-run
```

To dry-run against a local export instead of calling the API (dry runs only):

```bash
npx sanity migrations run fix-savanna-spelling --from-export=<backup.tar.gz>
```

## Verifying

The migration is idempotent — the filter stops matching once the value is
corrected, so re-runs are a no-op. Verification is the same query returning zero:

```groq
count(*[_type == "nativePlant" && "Savannah" in habitatType])
```

Then spot-check in Studio that the habitat filter on the plant list page returns
the expected plants for "Savanna".

## Companion code changes

This migration must ship alongside:

- `schemas/documents/nativePlant.js` — the `habitatType` picklist option
- `utilities/constants.js` — `HABITAT_OPTIONS`, which drives the front-end filter
- `tests/mocks/sanity-mocks.js` — mock fixture

The Studio is hosted by Sanity rather than embedded, so the schema change also
needs `npx sanity deploy`. Between the code deploy and the migration run there is
a brief window where the picklist and the stored data disagree and the habitat
filter under-matches; the migration takes seconds, so keep the two close together.
