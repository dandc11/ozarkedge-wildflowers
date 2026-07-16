# fix-nearby-commonname

Forward-corrects `growingNearbyPlantList[].commonName` values that were overwritten with the item's `plantBotanicalName` by the Dec-2025 `convert-nearby-plants` migration (its line `const commonName = item.caption || ''`, where the legacy `figure` caption held the botanical name).

## What it does

For every nearby-plant item where `commonName == plantBotanicalName`:

1. Looks up the **real** common name from the linked `nativePlant` document (`plantName.commonName[0]` where a `plantName.botanicalName` alias matches `plantBotanicalName`).
2. If a distinct real common name exists → **sets** `commonName` to it.
3. Otherwise → **unsets** `commonName` (clears the bogus value). The field is optional, editor-reference-only, and not rendered on the site.

Only corrupted items are touched, so it is **idempotent** and safe to re-run.

## Scope at time of writing

43 published `nativePlant` documents / 511 items (verify with the dry-run — the count changes as docs are edited). Runs against draft variants too (`perspective: 'raw'`).

## Run it

**Always** take a fresh dataset export and run the dry-run first.

```bash
# 0. Fresh backup
npx sanity dataset export prod ./oe-dataset-backups/$(date +%m-%d-%y)/backup-$(date +%Y%m%d).tar.gz

# 1. Dry run (default — no writes)
npx sanity exec migrations/fix-nearby-commonname/index.js --with-user-token

# 2. Execute
npx sanity exec migrations/fix-nearby-commonname/index.js --with-user-token -- --execute
```

## Verify afterwards

```groq
// should return 0
count(*[_type=="nativePlant"].growingNearbyPlantList[defined(commonName) && commonName == plantBotanicalName])
```

## Notes

- Published docs corrected this way will need re-publishing if you want the change live (the patch writes to the document as fetched; confirm draft/published handling for your workflow).
- See the `sanity-migrations` skill for the full safety checklist.
