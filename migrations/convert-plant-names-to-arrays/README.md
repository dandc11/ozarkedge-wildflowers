# Plant Names Array Conversion Migration

## Overview

Converts `plantName.commonName` and `plantName.botanicalName` from comma-delimited strings to arrays of strings.

## What It Does

- **Splits** comma-delimited names into arrays
- **Trims** whitespace from each name
- **Preserves** order (original name becomes first array item)
- **Does NOT modify** the `slug` field (all URLs remain unchanged)
- **Only updates** published documents (excludes drafts)

## Examples

**Before:**

```javascript
{
  plantName: {
    commonName: "Northern Blazing Star, Blazing Star, Savanna Blazing Star",
    botanicalName: "Liatris scariosa var. nieuwlandii"
  }
}
```

**After:**

```javascript
{
  plantName: {
    commonName: ["Northern Blazing Star", "Blazing Star", "Savanna Blazing Star"],
    botanicalName: ["Liatris scariosa var. nieuwlandii"]
  }
}
```

## Safety Checklist

- [ ] **Backup dataset** before running
- [ ] **Test on development dataset** first
- [ ] **Run with `--dry-run`** to preview changes
- [ ] **Review migration logs** for warnings
- [ ] **Verify slug preservation** (URLs should not change)
- [ ] **Test Studio editing** after migration
- [ ] **Test frontend display** after migration

## Usage

### 1. Dry Run (Preview Changes)

```bash
npx sanity migration run convert-plant-names-to-arrays --dry-run
```

Review the output to ensure:

- Only expected documents are affected
- Name splitting works correctly
- No errors or warnings

### 2. Execute Migration

```bash
npx sanity migration run convert-plant-names-to-arrays
```

### 3. Verify Results

After running:

1. Check Sanity Studio - edit a plant document to verify names appear as tags
2. Check frontend - verify plant cards display only first name
3. Check URLs - verify slugs are unchanged
4. Check filtering - verify plant list search works with all names

## Rollback

This migration is **one-way**. To rollback:

1. Restore from backup
2. Or manually convert arrays back to strings (not recommended)

## Notes

- Migration uses atomic updates (whole field replacement)
- Single-name plants become single-item arrays
- Empty slots after splitting are filtered out
- Schema must be updated **before** running migration
- Frontend code must handle arrays **before** deploying migration

## Related Files

- Schema: `schemas/objects/plantName.js`
- Component: `components/PlantName.js`
- Queries: `sanity/lib/queries.js`
- Tests: `tests/mocks/sanity-mocks.js`
