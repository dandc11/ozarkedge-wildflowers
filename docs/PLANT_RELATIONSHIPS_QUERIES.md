# Plant Relationship Query Patterns

This document outlines GROQ query patterns for working with plant relationships via the `nearbyPlantFigure` schema and botanical name identifiers.

## Core Concept

Plants are linked using `plantName.botanicalName` as a natural key. The `growingNearbyPlantList` field stores `nearbyPlantFigure` objects that include both an image and a `plantBotanicalName` string. Queries dynamically resolve these botanical names to actual `nativePlant` documents when they exist.

## Auto-Linking Pattern

### Basic Auto-Link Resolution

```groq
*[_type == "nativePlant" && slug.current == $slug][0] {
  _id,
  plantName,
  slug,
  "nearbyPlants": growingNearbyPlantList[]{
    ...,
    "linkedPlant": *[_type == "nativePlant" &&
      lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
      _id,
      slug,
      plantName,
      previewImage {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      }
    }
  }
}
```

**Key features:**

- Case-insensitive matching via `lower()`
- Uses `^.` to reference parent context (the nearby plant figure)
- Returns `null` for `linkedPlant` when no matching plant exists
- Fetches preview image for linked plants

### With Trim for Whitespace Safety

```groq
"linkedPlant": *[_type == "nativePlant" &&
  lower(string::trim(plantName.botanicalName)) == lower(string::trim(^.plantBotanicalName))
][0]{...}
```

## Homepage Plant Selector Feature

### Step 1: Populate Dropdown

```groq
// Get all plants for typeahead Select component
*[_type == "nativePlant"] | order(plantName.commonName asc) {
  "value": plantName.botanicalName,
  "label": plantName.commonName + " (" + plantName.botanicalName + ")",
  _id,
  slug,
  previewImage {
    ...,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  }
}
```

### Step 2: Get Selected Plant's Nearby Plants

```groq
*[_type == "nativePlant" && plantName.botanicalName == $selectedPlant][0] {
  _id,
  plantName,
  slug,
  "nearbyPlants": growingNearbyPlantList[]{
    plantBotanicalName,
    commonName,
    image {
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    "linkedPlant": *[_type == "nativePlant" &&
      lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
      _id,
      slug,
      plantName,
      previewImage
    }
  }
}
```

### Step 3: Bidirectional Lookup

Show both "Plant A grows near Plant B" AND "Plant B grows near Plant A":

```groq
{
  "sourcePlant": *[_type == "nativePlant" && plantName.botanicalName == $selectedPlant][0] {
    _id,
    plantName,
    slug,
    "grownNearby": growingNearbyPlantList[]{
      plantBotanicalName,
      image,
      "linkedPlant": *[_type == "nativePlant" &&
        lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
        _id, slug, plantName, previewImage
      }
    }
  },
  "mentionedBy": *[_type == "nativePlant" &&
    lower($selectedPlant) in growingNearbyPlantList[].plantBotanicalName] {
    _id,
    plantName,
    slug,
    previewImage,
    "relevantImages": growingNearbyPlantList[
      lower(plantBotanicalName) == lower($selectedPlant)
    ]{
      image,
      plantBotanicalName
    }
  }
}
```

## Network Analysis

### Most Connected Plants

Find plants mentioned most frequently across all `growingNearbyPlantList` entries:

```groq
*[_type == "nativePlant"] {
  plantName,
  slug,
  _id,
  "outboundConnections": count(growingNearbyPlantList),
  "inboundConnections": count(*[_type == "nativePlant" &&
    ^.plantName.botanicalName in growingNearbyPlantList[].plantBotanicalName
  ]),
  "totalConnections": count(growingNearbyPlantList) + count(*[_type == "nativePlant" &&
    ^.plantName.botanicalName in growingNearbyPlantList[].plantBotanicalName
  ])
} | order(totalConnections desc)[0...10]
```

**Use cases:**

- Dashboard widget showing "most connected" plants
- Identify hub species for educational content
- Data visualization (network graphs)

### Plant Association Clusters

Find groups of plants that frequently appear together:

```groq
*[_type == "nativePlant"] {
  plantName,
  "companions": growingNearbyPlantList[].plantBotanicalName,
  "companionDetails": growingNearbyPlantList[]{
    plantBotanicalName,
    "plant": *[_type == "nativePlant" &&
      plantName.botanicalName == ^.plantBotanicalName][0]{
      plantName,
      floweringSeason,
      habitatType
    }
  }
}[count(companions) > 2]
```

## Habitat Co-Occurrence Analysis

### Plants in Same Habitat

```groq
*[_type == "nativePlant" && $habitat in habitatType] {
  plantName,
  habitatType,
  floweringSeason,
  "nearbyPlants": growingNearbyPlantList[]{
    plantBotanicalName,
    "linkedPlant": *[_type == "nativePlant" &&
      plantName.botanicalName == ^.plantBotanicalName][0]{
      plantName,
      habitatType,
      floweringSeason,
      flowerColor
    }
  },
  "sharedHabitatCompanions": growingNearbyPlantList[]{
    plantBotanicalName,
    "plant": *[_type == "nativePlant" &&
      plantName.botanicalName == ^.plantBotanicalName &&
      $habitat in habitatType][0]{
      plantName,
      habitatType
    }
  }[defined(plant)]
}
```

**Use cases:**

- Generate habitat-specific planting guides
- "If you have X habitat, consider these companion plants"
- Ecological relationship mapping

## Validation & Quality Queries

### Orphaned Plant Names

Find botanical names that don't match any existing plant document:

```groq
*[_type == "nativePlant"]{
  _id,
  plantName,
  "orphanedPlants": growingNearbyPlantList[
    !defined(*[_type == "nativePlant" &&
      lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0])
  ]{
    plantBotanicalName,
    commonName
  }
}[count(orphanedPlants) > 0]
```

**Use cases:**

- Dashboard widget showing plants that need pages created
- Editorial checklist for content completeness
- Validate botanical name spelling consistency

### Duplicate Botanical Names

Ensure uniqueness of botanical names (should always return empty):

```groq
*[_type == "nativePlant"] {
  "botanicalName": plantName.botanicalName,
  "duplicates": *[_type == "nativePlant" &&
    plantName.botanicalName == ^.plantName.botanicalName &&
    _id != ^._id
  ]
}[count(duplicates) > 0]
```

## Seasonal & Color Queries

### Companion Plants by Season

```groq
*[_type == "nativePlant" && floweringSeason == $season] {
  plantName,
  floweringSeason,
  flowerColor,
  "seasonalCompanions": growingNearbyPlantList[]{
    plantBotanicalName,
    "linkedPlant": *[_type == "nativePlant" &&
      plantName.botanicalName == ^.plantBotanicalName &&
      floweringSeason == $season][0]{
      plantName,
      flowerColor,
      floweringSeason
    }
  }[defined(linkedPlant)]
}
```

### Color Palette Suggestions

Find companion plants with complementary flower colors:

```groq
*[_type == "nativePlant" && _id == $plantId][0] {
  plantName,
  flowerColor,
  "companions": growingNearbyPlantList[]{
    plantBotanicalName,
    "linkedPlant": *[_type == "nativePlant" &&
      plantName.botanicalName == ^.plantBotanicalName][0]{
      plantName,
      flowerColor,
      previewImage
    }
  }[defined(linkedPlant.flowerColor)]
}
```

## Advanced: Graph Traversal

### Two-Degree Connections

"Friends of friends" - plants connected through intermediary plants:

```groq
*[_type == "nativePlant" && _id == $plantId][0] {
  plantName,
  "directCompanions": growingNearbyPlantList[]{
    plantBotanicalName,
    "linkedPlant": *[_type == "nativePlant" &&
      plantName.botanicalName == ^.plantBotanicalName][0]{
      plantName,
      _id,
      "theirCompanions": growingNearbyPlantList[]{
        plantBotanicalName,
        "linkedPlant": *[_type == "nativePlant" &&
          plantName.botanicalName == ^.plantBotanicalName][0]{
          plantName,
          slug
        }
      }
    }
  }
}
```

**Use cases:**

- "People who planted X also considered Y and Z"
- Extended habitat recommendations
- Educational "ecosystem web" visualizations

## Performance Considerations

### Projection Optimization

Only fetch fields you need:

```groq
// Heavy (don't do this)
"linkedPlant": *[...][0]

// Optimized
"linkedPlant": *[...][0]{
  _id,
  slug,
  plantName.botanicalName,
  plantName.commonName
}
```

### Caching Strategy

- Cache plant selector dropdown data (changes infrequently)
- Use ISR (Incremental Static Regeneration) for plant pages
- Consider Redis cache for network analysis queries
- Pre-compute "most connected" plants on schedule

### Indexing Recommendations

Consider Sanity GROQ indexes for:

- `plantName.botanicalName` (exact match)
- `lower(plantName.botanicalName)` (if supported)
- `growingNearbyPlantList[].plantBotanicalName`

## Future Enhancements

### Weighted Relationships

Add a `relationshipStrength` field to track:

- Co-occurrence frequency
- Physical proximity (meters)
- Shared habitat percentage
- Bloom time overlap

### Taxonomy Integration

Extend to family/genus level associations:

```groq
"sameFamily": *[_type == "nativePlant" &&
  plantTaxonomy.family == ^.plantTaxonomy.family &&
  _id != ^._id
]
```

### Pollinator Bridge Queries

Find plants via shared pollinators:

```groq
"pollinatorBridge": *[_type == "nativePlant" &&
  count(pollinators[@._ref in ^.pollinators[]._ref]) > 0
]
```

## Example Component Integration

```javascript
// In a React component
const nearbyPlantsQuery = groq`
  *[_type == "nativePlant" && slug.current == $slug][0] {
    "nearbyPlants": growingNearbyPlantList[]{
      ...,
      "linkedPlant": *[_type == "nativePlant" && 
        lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
        _id, slug, plantName, previewImage
      }
    }
  }
`

const { data } = await sanityFetch({
  query: nearbyPlantsQuery,
  params: { slug },
})

// Render with conditional linking
{
  data.nearbyPlants.map((nearby) => (
    <PlantImage
      image={nearby.image}
      linkTo={nearby.linkedPlant?.slug}
      alt={nearby.plantBotanicalName}
    />
  ))
}
```

---

**Last Updated:** December 2025  
**Schema Version:** nearbyPlantFigure v1.0
