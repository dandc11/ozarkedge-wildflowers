import {
  DEFAULT_SOURCE,
  DEFAULT_TAXON_GROUP,
  OBSERVATION_SOURCES,
  TAXON_GROUPS,
  parseBbox,
} from '../../../utilities/observationSources'

/**
 * GET /api/observations
 *
 * Returns a GeoJSON FeatureCollection of recent observations for the observation
 * map, pulled server-side from the selected source and normalized to a common
 * feature shape. Every feature carries its own source / attribution / sourceUrl /
 * license so provenance stays attached to the data.
 *
 * Query params:
 *   - source: observation source key (default "inat")
 *   - taxon:  taxon group key (default "plants")
 *   - bbox:   "swlng,swlat,nelng,nelat" (defaults to the Ozark Highlands)
 *
 * Framing note: these are records of where people *looked and reported*, not where
 * species live. The UI frames everything as "observed," never "lives here."
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sourceKey = searchParams.get('source') || DEFAULT_SOURCE
  const taxonKey = searchParams.get('taxon') || DEFAULT_TAXON_GROUP
  const bbox = parseBbox(searchParams.get('bbox'))

  const source = OBSERVATION_SOURCES[sourceKey]
  if (!source || !source.enabled || typeof source.fetchFn !== 'function') {
    return Response.json(
      { error: `Unknown or unavailable observation source: ${sourceKey}` },
      { status: 400 },
    )
  }

  const taxonGroup = TAXON_GROUPS[taxonKey]
  if (!taxonGroup) {
    return Response.json({ error: `Unknown taxon group: ${taxonKey}` }, { status: 400 })
  }

  try {
    const features = await source.fetchFn({ taxonGroup, bbox })
    const body = {
      type: 'FeatureCollection',
      features,
      metadata: {
        source: source.key,
        sourceLabel: source.label,
        sourceUrl: source.homeUrl,
        attribution: source.attribution,
        license: source.license,
        taxon: taxonGroup.key,
        taxonLabel: taxonGroup.label,
        count: features.length,
      },
    }
    return Response.json(body, {
      headers: {
        // Cache at the edge; allow a stale copy while revalidating in the background.
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    return Response.json(
      { error: 'Failed to fetch observations', detail: String(err?.message || err) },
      { status: 502 },
    )
  }
}
