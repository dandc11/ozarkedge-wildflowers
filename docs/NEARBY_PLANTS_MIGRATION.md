# Growing Nearby Plants - Migration Complete

## Migration Status

✅ **COMPLETED** - December 26, 2025

### Final Results

- **55 documents** successfully migrated
- **650+ entries** converted from `figure` to `nearbyPlantFigure` format
- **All legacy data cleaned** - figure entries and duplicates removed
- **1 entry skipped** - "Rue Anemone" (botanical name extraction failed)

### Migration History

1. **Initial Conversion** - Converted all figure entries to nearbyPlantFigure format
2. **Accidental Double Run** - Migration ran twice, creating triplicates
3. **Cleanup Migration** - Removed all legacy figure entries and duplicate nearbyPlantFigure entries

---

## What Changed

The `growingNearbyPlantList` field now uses a new format called **Nearby Plant (with Auto-Linking)** that includes botanical names. This enables automatic linking to plant pages and supports future features like plant relationship analysis and the homepage plant selector.

## For Content Editors

### What You'll See in Sanity Studio

When editing a Native Plant document's "Plants Growing Nearby" section:

#### All Entries Are Now Auto-Linking Format

- **Migration complete** - All old entries have been converted to the new format
- All entries now support automatic linking to plant pages
- Each entry shows the botanical name and optionally a common name

#### Adding New Entries

When you click **"Add item"**, you'll see:

**"Nearby Plant (with Auto-Linking)"**

- **Required fields:**
  - Plant Image (upload or select)
  - Botanical Name (e.g., "Echinacea pallida")
- **Optional field:**
  - Common Name (for display purposes)

### How to Use the New Format

1. Click "Add item" in the Growing Nearby Plants section
2. Upload or select the plant image
3. Enter the **botanical name** exactly as it appears on that plant's page
   - Example: `Echinacea pallida` (not "pale purple coneflower")
   - Case doesn't matter: "Echinacea pallida" = "echinacea pallida"
   - Spaces are trimmed automatically
4. Optionally add the common name for your reference
5. Save the document

### How Auto-Linking Works

When you enter a botanical name:

- **If a plant page exists** with that botanical name → the image will automatically link to it on the live site
- **If no plant page exists yet** → the image displays without a link
- **When you later create the plant page** → all existing references automatically become links (no re-editing needed!)

### Migrating Old Entries (Optional)

#### Using the Conversion Helper (Recommended)

The Studio now includes a built-in conversion helper that makes migration easier:

1. Open a plant document with old entries
2. Click **"Add item"** in the Growing Nearby Plants section
3. You'll see a blue helper card: **"💡 Convert an existing image?"**
4. Use the dropdown to select an old entry
5. The botanical name will be **automatically extracted** from the alt text or caption
6. **Review the botanical name** - edit if needed to match the exact name on the plant's page
7. The image will be copied automatically
8. Click Save

**Important:** The conversion creates a new entry but doesn't delete the old one. After verifying the conversion worked correctly, manually delete the old entry.

#### Manual Migration (Alternative)

If you prefer to migrate manually or the auto-extraction doesn't work:

1. Open a plant document
2. For each old entry in Growing Nearby Plants (shows as just an image):
   - Click the entry to expand it
   - Note which plant it shows (check the alt text or caption)
   - Click the "..." menu → Delete
3. Click "Add item"
4. Add the same image
5. Enter the botanical name
6. Save

**Pro tip:** Start with plants you're actively editing. No rush to migrate everything at once.

## For Developers

### Schema Structure

**Union type** allows both formats during transition, with legacy format hidden from UI:

```javascript
of: [
  defineArrayMember({ type: 'nearbyPlantFigure' }), // New format (visible in "Add item" menu)
  defineArrayMember({
    type: 'figure',
    hidden: true, // Legacy format (hidden from menu, preserved for existing data)
  }),
]
```

This approach:

- ✅ Prevents editors from adding new legacy entries
- ✅ Preserves all existing legacy data
- ✅ Allows viewing/editing of existing legacy entries
- ✅ Simplifies the editor experience (no confusing choices)

### Query Handling

GROQ queries must handle both types:

```groq
"nearbyPlants": growingNearbyPlantList[]{
  ...,
  _type == "nearbyPlantFigure" => {
    plantBotanicalName,
    commonName,
    image,
    "linkedPlant": *[_type == "nativePlant" &&
      lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
      _id, slug, plantName, previewImage
    }
  },
  _type == "figure" => {
    "image": @,
    "plantBotanicalName": coalesce(caption, alt),
    "linkedPlant": null
  }
}
```

### Component Updates

The `GrowingNearbySection` component needs to:

1. Check the `_type` of each entry
2. Extract image from `item.image` (nearbyPlantFigure) or `item` (figure)
3. Use `item.linkedPlant?.slug` for link (null-safe)

Example:

```javascript
{
  nearbyPlants.map((item) => {
    const image = item._type === 'nearbyPlantFigure' ? item.image : item
    const linkSlug = item.linkedPlant?.slug

    return (
      <InteractiveImage
        image={image}
        linkTo={linkSlug ? `/native-plants/${linkSlug}` : null}
        alt={item.plantBotanicalName || image.alt}
      />
    )
  })
}
```

### Migration Timeline

**Phase 1: Coexistence (Current)**

- Both formats work
- Editors gradually adopt new format

**Phase 2: Migration Tool (Optional)**

- Build Studio action or script to bulk convert
- Attempts to extract botanical names from alt/caption

**Phase 3: Deprecation (Future)**

- When <5% of entries are legacy format
- Remove `figure` from union type
- Clean query logic

### Benefits of This Approach

✅ **Zero breaking changes** - existing site continues working  
✅ **Gradual adoption** - no forced migration deadline  
✅ **Auto-linking** - new entries link automatically when pages exist  
✅ **Data integrity** - botanical names are first-class fields (not buried in alt text)  
✅ **Future-proof** - enables network analysis, plant selector, habitat queries

## Monitoring Migration Progress

Use this GROQ query to check adoption:

```groq
{
  "total": count(*[_type == "nativePlant"].growingNearbyPlantList[]),
  "newFormat": count(*[_type == "nativePlant"].growingNearbyPlantList[_type == "nearbyPlantFigure"]),
  "legacyFormat": count(*[_type == "nativePlant"].growingNearbyPlantList[_type == "figure"]),
  "percentNew": (count(*[_type == "nativePlant"].growingNearbyPlantList[_type == "nearbyPlantFigure"]) / count(*[_type == "nativePlant"].growingNearbyPlantList[])) * 100
}
```

Run in Vision Tool to see adoption rate.

## Post-Migration Cleanup

**Execute these steps only after verifying all legacy entries have been migrated.**

### Step 1: Verify No Legacy Entries Remain

Run this GROQ query in Vision Tool:

```groq
*[_type == "nativePlant" && count(growingNearbyPlantList[_type == "figure"]) > 0]{
  _id,
  "plantName": plantName.botanicalName,
  "legacyCount": count(growingNearbyPlantList[_type == "figure"]),
  "legacyEntries": growingNearbyPlantList[_type == "figure"]{
    alt,
    caption,
    _key
  }
}
```

**Expected result:** Empty array `[]`

If any documents appear, complete their migration before proceeding.

### Step 2: Remove Legacy Format from Schema

In `schemas/documents/nativePlant.js`, update the `growingNearbyPlantList` field:

**Before:**

```javascript
of: [
  defineArrayMember({ type: 'nearbyPlantFigure' }),
  defineArrayMember({ type: 'figure', hidden: true }), // ← Remove this line
]
```

**After:**

```javascript
of: [defineArrayMember({ type: 'nearbyPlantFigure' })]
```

### Step 3: Clean Up GROQ Queries

In `sanity/lib/queries.js`, simplify the `GET_PLANT_PAGE_DATA` query:

**Before:**

```groq
"nearbyPlants": growingNearbyPlantList[]{
  ...,
  _type == "nearbyPlantFigure" => {
    plantBotanicalName,
    commonName,
    image,
    "linkedPlant": *[_type == "nativePlant" &&
      lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
      _id, slug, plantName, previewImage
    }
  },
  _type == "figure" => {  // ← Remove this entire block
    "image": @,
    "plantBotanicalName": coalesce(caption, alt),
    "linkedPlant": null
  }
}
```

**After:**

```groq
"nearbyPlants": growingNearbyPlantList[]{
  ...,
  plantBotanicalName,
  commonName,
  image,
  "linkedPlant": *[_type == "nativePlant" &&
    lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
    _id, slug, plantName, previewImage
  }
}
```

### Step 4: Remove Normalization Logic

In `utilities/plantUtil.js`, remove the `normalizeGrowingNearbyPlants()` function (no longer needed).

In `components/GrowingNearbySection.js`:

**Before:**

```javascript
import { normalizeGrowingNearbyPlants } from '@/utilities/plantUtil'

export default function GrowingNearbySection({ nearbyPlants }) {
  const normalized = normalizeGrowingNearbyPlants(nearbyPlants)
  // ...
}
```

**After:**

```javascript
export default function GrowingNearbySection({ nearbyPlants }) {
  // Use nearbyPlants directly - no normalization needed
  // ...
}
```

Update component logic to expect a consistent structure:

```javascript
{
  nearbyPlants.map((item) => (
    <InteractiveImage
      image={item.image}
      linkTo={item.linkedPlant?.slug ? `/native-plants/${item.linkedPlant.slug}` : null}
      alt={item.plantBotanicalName}
    />
  ))
}
```

### Step 5: Remove Migration Helper Component

Delete the custom input component (optional - it could remain for reference):

```bash
rm schemas/components/NearbyPlantInput.js
```

In `schemas/objects/nearbyPlantFigure.js`, remove the custom component:

**Before:**

```javascript
import { NearbyPlantInput } from '../components/NearbyPlantInput'

export default defineType({
  name: 'nearbyPlantFigure',
  title: 'Nearby Plant (with Auto-Linking)',
  type: 'object',
  components: {
    input: NearbyPlantInput, // ← Remove this
  },
  // ...
})
```

**After:**

```javascript
export default defineType({
  name: 'nearbyPlantFigure',
  title: 'Nearby Plant (with Auto-Linking)',
  type: 'object',
  // ...
})
```

### Step 6: Test Thoroughly

1. **Schema validation:** Restart Sanity Studio and verify no errors
2. **Query validation:** Test queries in Vision Tool - all should return nearbyPlantFigure objects only
3. **Component rendering:** View plant pages on the site - all nearby plants should display correctly
4. **Editor workflow:** Create/edit a plant document - verify only nearbyPlantFigure appears in "Add item"

### Step 7: Deploy

1. Commit changes to version control
2. Deploy to production
3. Verify live site continues working correctly

### Checklist

- [ ] Verified zero legacy entries remain (GROQ query returns `[]`)
- [ ] Removed `figure` from `growingNearbyPlantList` union type
- [ ] Simplified GROQ queries (removed legacy handling)
- [ ] Removed `normalizeGrowingNearbyPlants()` utility function
- [ ] Updated `GrowingNearbySection` component (removed normalization call)
- [ ] Removed `NearbyPlantInput` custom component (optional)
- [ ] Removed component registration from `nearbyPlantFigure` schema (optional)
- [ ] Tested schema, queries, and components
- [ ] Deployed to production
- [ ] Verified live site functionality

**Estimated cleanup time:** 15-30 minutes  
**Risk level:** Low (if verification step confirms zero legacy entries)

---

**Migration Started:** December 2025  
**Completion Target:** Gradual (no deadline)  
**Legacy Format Removal:** When >95% migrated
