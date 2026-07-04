/**
 * Observation source registry for the "A Changing Landscape" observation map.
 *
 * The section never generates an original scientific claim: it presents other
 * people's observations, attributed and linked. Every source normalizes its
 * records to the same GeoJSON `Feature` shape, and every feature carries its own
 * `source`, `attribution`, `sourceUrl` and `license` so provenance is structural.
 *
 * Sources are modeled as distinct, selectable layers — never silently merged.
 * iNaturalist research-grade records flow into GBIF (a superset), so merging the
 * two raw would double-count. Keeping them separate is both honest and simpler,
 * and leaves room to add GBIF and (future) cite-and-link projection layers.
 */

/** Default bounding box for the Ozark Highlands (approx. northern AR / southern MO). */
export const DEFAULT_BBOX = {
  swlat: 35.0,
  swlng: -94.6,
  nelat: 37.6,
  nelng: -90.4,
}

/**
 * Friendly taxon groups mapped to source-specific query params.
 * `inat.iconic_taxa` is the iNaturalist iconic-taxon filter.
 */
export const TAXON_GROUPS = {
  plants: {
    key: 'plants',
    label: 'Trees, shrubs & wildflowers',
    inat: { iconic_taxa: 'Plantae' },
  },
  birds: {
    key: 'birds',
    label: 'Birds',
    inat: { iconic_taxa: 'Aves' },
  },
  pollinators: {
    key: 'pollinators',
    label: 'Pollinators',
    inat: { iconic_taxa: 'Insecta' },
  },
}

export const DEFAULT_TAXON_GROUP = 'plants'

/**
 * Parse a `swlng,swlat,nelng,nelat` bbox string into the object shape used here.
 * Falls back to DEFAULT_BBOX when the string is missing or malformed.
 * @param {string|null} bboxStr
 * @returns {{swlat:number, swlng:number, nelat:number, nelng:number}}
 */
export const parseBbox = (bboxStr) => {
  if (!bboxStr) return DEFAULT_BBOX
  const parts = bboxStr.split(',').map((n) => Number(n.trim()))
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return DEFAULT_BBOX
  const [swlng, swlat, nelng, nelat] = parts
  return { swlat, swlng, nelat, nelng }
}

/**
 * Normalize an iNaturalist observation into a GeoJSON Feature.
 * Returns null when the record has no usable point geometry.
 * @param {object} obs - a single iNaturalist observation record
 * @returns {object|null} GeoJSON Feature
 */
const normalizeInatObservation = (obs) => {
  const coordinates = obs?.geojson?.coordinates
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null
  const [lng, lat] = coordinates
  if (typeof lng !== 'number' || typeof lat !== 'number') return null

  const observer = obs?.user?.login
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: {
      id: `inat-${obs.id}`,
      source: 'inat',
      scientificName: obs?.taxon?.name ?? null,
      commonName: obs?.taxon?.preferred_common_name ?? null,
      observedOn: obs?.observed_on ?? null,
      sourceUrl: obs?.uri ?? (obs?.id ? `https://www.inaturalist.org/observations/${obs.id}` : null),
      photoUrl: obs?.photos?.[0]?.url ?? null,
      license: obs?.license_code ?? null,
      attribution: observer ? `Observed by ${observer} · iNaturalist (CC BY-NC)` : 'iNaturalist (CC BY-NC)',
    },
  }
}

/**
 * Fetch and normalize observations from the iNaturalist API.
 * @param {object} opts
 * @param {object} opts.taxonGroup - an entry from TAXON_GROUPS
 * @param {object} opts.bbox - {swlat, swlng, nelat, nelng}
 * @param {number} [opts.perPage=200]
 * @returns {Promise<object[]>} array of GeoJSON Features
 */
const fetchInatObservations = async ({ taxonGroup, bbox, perPage = 200 }) => {
  const params = new URLSearchParams({
    geo: 'true',
    verifiable: 'true',
    quality_grade: 'research',
    photos: 'true',
    order_by: 'observed_on',
    order: 'desc',
    per_page: String(perPage),
    swlat: String(bbox.swlat),
    swlng: String(bbox.swlng),
    nelat: String(bbox.nelat),
    nelng: String(bbox.nelng),
  })
  if (taxonGroup?.inat?.iconic_taxa) {
    params.set('iconic_taxa', taxonGroup.inat.iconic_taxa)
  }

  const url = `https://api.inaturalist.org/v1/observations?${params.toString()}`
  // Cache at the fetch layer: keeps keys server-side and respects iNat's ~60/min limit.
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  })
  if (!res.ok) {
    throw new Error(`iNaturalist request failed: ${res.status}`)
  }
  const json = await res.json()
  const results = Array.isArray(json?.results) ? json.results : []
  return results.map(normalizeInatObservation).filter(Boolean)
}

/**
 * The source registry. `fetchFn` returns an array of normalized GeoJSON Features.
 * GBIF is registered but disabled for the MVP — its `fetchFn` shape is documented
 * so it can be turned on later without reworking the map or the route handler.
 */
export const OBSERVATION_SOURCES = {
  inat: {
    key: 'inat',
    label: 'iNaturalist',
    homeUrl: 'https://www.inaturalist.org',
    license: 'CC BY-NC',
    attribution: 'Observations by the iNaturalist community (CC BY-NC)',
    enabled: true,
    fetchFn: fetchInatObservations,
  },
  gbif: {
    key: 'gbif',
    label: 'GBIF',
    homeUrl: 'https://www.gbif.org',
    license: 'CC0 / CC BY',
    attribution: 'Occurrence data via GBIF.org',
    enabled: false,
    // fetchFn: async ({ taxonGroup, bbox, perPage }) => { /* query api.gbif.org/v1/occurrence/search, normalize to the same Feature shape */ },
    fetchFn: null,
  },
}

export const DEFAULT_SOURCE = 'inat'

/**
 * Attribution entries always shown in the map's Sources panel, regardless of the
 * active observation source (basemap + ecoregion boundaries).
 */
export const BASE_ATTRIBUTIONS = [
  { label: 'Basemap', text: '© OpenStreetMap contributors · OpenFreeMap', url: 'https://openfreemap.org' },
  { label: 'Ecoregions', text: 'EPA Level III Ecoregions (Omernik) — public domain', url: 'https://www.epa.gov/eco-research/ecoregions' },
]
