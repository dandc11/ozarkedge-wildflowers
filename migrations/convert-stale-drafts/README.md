# convert-stale-drafts

Brings stale `nativePlant` **draft** documents up to the current schema shape. Drafts-only — no published document is touched.

## Why

`convert-plant-names-to-arrays` filters drafts out (`!(_id in path("drafts.**"))`), and the Dec-2025 `convert-nearby-plants` run never processed these drafts either. Their published counterparts were converted, so three drafts sat in the pre-migration shape and now fail Studio validation:

- `plantName.commonName` / `plantName.botanicalName` are strings where the schema expects arrays → _"Invalid property value"_.
- `growingNearbyPlantList` still holds legacy `figure` items, which the current schema no longer declares → _"Item of type `figure` not valid for this list"_.

**The risk this closes:** the Delphinium tricorne draft has a clean published counterpart. Publishing it as-is would overwrite that published document with the pre-migration shape, undoing the earlier conversion. The Studio's "Reset value" buttons on the invalid fields would also erase the names outright.

`fix-nearby-commonname` (#304) is **not** implicated — it only ever patches `growingNearbyPlantList[].commonName`, and cannot produce either symptom.

## Affected drafts

| Draft ID     | Common name                    | Botanical name           | Problem                                 |
| ------------ | ------------------------------ | ------------------------ | --------------------------------------- |
| `2ad8b68d-…` | Dwarf larkspur                 | Delphinium tricorne      | String names + 13 legacy `figure` items |
| `66e83331-…` | Plains or Prairie prickly pear | Opuntia macrorhiza       | String names (never published)          |
| `7b6edb89-…` | Rue Anenome                    | Thalictrum thalictroides | String names (never published)          |

## What it does

**Names** — converts string → array, preserving order, using the same comma-split as `convert-plant-names-to-arrays`.

`"Plains or Prairie prickly pear"` packs two names into one phrase with no comma, so a plain split would yield one wrong entry. It's handled by an explicit `COMMON_NAME_OVERRIDES` entry keyed on the exact stored string, producing `["Plains prickly pear", "Prairie prickly pear"]`. The override is keyed by exact match so it cannot fire on anything else — extend the map rather than adding parsing heuristics.

**Nearby plants** — converts legacy `figure` items to `nearbyPlantFigure`, mirroring exactly what the Dec-2025 conversion produced in published data (verified field-by-field against `2ad8b68d-…`):

| `figure`                                                         | →   | `nearbyPlantFigure`                                                                                 |
| ---------------------------------------------------------------- | --- | --------------------------------------------------------------------------------------------------- |
| `_key: "<k>"`                                                    | →   | `_key: "converted-<k>"`                                                                             |
| `asset` / `alt` / `caption` / `showCaption` / `crop` / `hotspot` | →   | nested under `image`                                                                                |
| `caption` (held the botanical name in legacy data)               | →   | `plantBotanicalName`                                                                                |
| `link.internalLink`                                              | →   | **dropped** — `nearbyPlantFigure` has no link field; auto-linking derives from `plantBotanicalName` |
| `captionPosition`                                                | →   | **dropped** — not a field on the image                                                              |

`commonName` is resolved from the linked `nativePlant` document rather than copied from the caption, so this does **not** reintroduce the `commonName == plantBotanicalName` corruption that #304 cleaned up. Where no distinct real common name exists, the field is omitted (it's optional and editor-reference-only).

## Safety

- The query filters to `_id in path("drafts.**")`, and every patch target is asserted to start with `drafts.` before any write — the run throws rather than touch a published document.
- Idempotent: only string-shaped names and `figure` items are selected, so a second run reports nothing to do.
- Dry-run by default; writing requires an explicit `--execute`.

## Usage

Take a fresh dataset export first — see [docs/BACKUP_AND_ROLLBACK.md](../../docs/BACKUP_AND_ROLLBACK.md).

```bash
# Dry run (default) — prints every planned change, writes nothing
npx sanity exec migrations/convert-stale-drafts/index.js --with-user-token

# Apply
npx sanity exec migrations/convert-stale-drafts/index.js --with-user-token -- --execute
```

`--with-user-token` populates `SANITY_AUTH_TOKEN`; the token is never printed.

## Out of scope

- The `"Rue Anenome"` → `"Rue Anemone"` typo, which has already propagated into published nearby-plant lists.
- Committing the missing `convert-nearby-plants` / `cleanup-nearby-plants-duplicates` sources.
- Any decision about discarding the Delphinium draft or its duplicate nearby-plant entries — this migration only makes the draft valid.
