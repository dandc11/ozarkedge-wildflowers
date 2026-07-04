# Static map data

Static GeoJSON assets served directly to the "A Changing Landscape" observation map.

## `ecoregions-ozark-highlands.geojson`

The ecoregion base layer the observation map draws under the occurrence points.

**Current state:** a **simplified placeholder** polygon approximating the Ozark
Highlands (EPA Level III ecoregion 39). It is intentionally low-fidelity so the
map has an honest spatial frame during the spike.

**To replace with the authoritative boundary:**

1. Download the EPA Level III Ecoregions (Omernik) — shapefile/GeoJSON, U.S. public
   domain: https://www.epa.gov/eco-research/ecoregions-north-america
2. Filter to the Ozark Highlands (`US_L3CODE` / `NA_L3CODE` = `39`) and, if desired,
   neighboring Mid-South ecoregions.
3. Clip to the area of interest and **simplify** the geometry (e.g. with `mapshaper`:
   `mapshaper in.shp -filter "US_L3CODE == '39'" -simplify 5% -o format=geojson out.geojson`)
   so the browser payload stays small.
4. Keep the `name` and `epaCode` properties on each feature; the map and the
   `ecoregion` Sanity document reference them.

**Attribution:** EPA Level III Ecoregions (Omernik). Public domain; credit the EPA.
This is displayed in the map's Sources & attribution panel via `BASE_ATTRIBUTIONS`
in `utilities/observationSources.js`.
