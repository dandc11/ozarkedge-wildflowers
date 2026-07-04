'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import { useCallback, useEffect, useRef, useState } from 'react'

import { BASE_ATTRIBUTIONS } from '../utilities/observationSources'

import ObservationCard from './ObservationCard'
import SourcesPanel from './SourcesPanel'

const BASEMAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'
const ECOREGION_URL = '/data/ecoregions-ozark-highlands.geojson'
const DEFAULT_CENTER = [-92.3, 36.6]
const DEFAULT_ZOOM = 6.4
const MAX_LIST_ITEMS = 60

const emptyCollection = { type: 'FeatureCollection', features: [] }

/**
 * Interactive observation map for the "A Changing Landscape" section.
 *
 * Renders a MapLibre map (OpenFreeMap Positron basemap) with the Ozark Highlands
 * ecoregion outline and recent observations pulled from /api/observations. The map
 * library is browser-only, so this whole component is a client boundary; MapLibre is
 * imported lazily inside an effect (never during render/SSR), which keeps this safe to
 * import directly from the server page without `next/dynamic`'s `ssr: false`.
 *
 * Everything is framed as "observed," never "lives here": presence-only records
 * show where people looked, not where species are.
 *
 * @param {Object} props
 * @param {Object} props.taxonGroups - map of taxon group key -> { key, label }
 * @param {Array<{key:string,label:string,homeUrl?:string,attribution?:string}>} props.sources - enabled observation sources
 * @param {string} [props.sourcesNote] - editorial provenance statement for the sources panel
 */
const ChangingLandscapeMap = ({ taxonGroups = {}, sources = [], sourcesNote }) => {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const mapReadyRef = useRef(false)
  const featuresRef = useRef([])

  const taxonKeys = Object.keys(taxonGroups)
  const [activeTaxon, setActiveTaxon] = useState(taxonKeys[0] || 'plants')
  const [activeSource, setActiveSource] = useState(sources[0]?.key || 'inat')
  const [features, setFeatures] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [status, setStatus] = useState('idle')
  const [selectedFeature, setSelectedFeature] = useState(null)

  // Keep a ref of the latest features so the map's async 'load' handler can read them.
  useEffect(() => {
    featuresRef.current = features
  }, [features])

  // Push the current features into the map's observation source, if the map is ready.
  const syncObservations = useCallback(() => {
    const map = mapRef.current
    if (!map || !mapReadyRef.current || typeof map.getSource !== 'function') return
    const src = map.getSource('observations')
    if (src && typeof src.setData === 'function') {
      src.setData({ type: 'FeatureCollection', features: featuresRef.current })
    }
  }, [])

  // Initialize the map once, on mount.
  useEffect(() => {
    let cancelled = false
    let map

    import('maplibre-gl')
      .then((mod) => {
        const maplibregl = mod.default || mod
        if (cancelled || !containerRef.current) return

        map = new maplibregl.Map({
          container: containerRef.current,
          style: BASEMAP_STYLE_URL,
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          attributionControl: false,
        })
        mapRef.current = map

        if (typeof map.addControl === 'function') {
          map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
        }

        map.on('load', () => {
          map.addSource('ecoregions', { type: 'geojson', data: ECOREGION_URL })
          map.addLayer({
            id: 'ecoregion-fill',
            type: 'fill',
            source: 'ecoregions',
            paint: { 'fill-color': '#8EAC52', 'fill-opacity': 0.08 },
          })
          map.addLayer({
            id: 'ecoregion-line',
            type: 'line',
            source: 'ecoregions',
            paint: { 'line-color': '#596C33', 'line-width': 1.5, 'line-dasharray': [2, 1] },
          })
          map.addSource('observations', { type: 'geojson', data: emptyCollection })
          map.addLayer({
            id: 'observation-points',
            type: 'circle',
            source: 'observations',
            paint: {
              'circle-radius': 5,
              'circle-color': '#C2410C',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1,
              'circle-opacity': 0.85,
            },
          })

          map.on('click', 'observation-points', (e) => {
            const f = e?.features?.[0]
            if (f) {
              setSelectedFeature({
                type: 'Feature',
                geometry: f.geometry,
                properties: f.properties,
              })
            }
          })
          map.on('mouseenter', 'observation-points', () => {
            map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', 'observation-points', () => {
            map.getCanvas().style.cursor = ''
          })

          mapReadyRef.current = true
          syncObservations()
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      mapReadyRef.current = false
      if (map && typeof map.remove === 'function') map.remove()
      mapRef.current = null
    }
  }, [syncObservations])

  // Fetch observations whenever the source or taxon group changes.
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setStatus('loading')
    setSelectedFeature(null)

    const params = new URLSearchParams({ source: activeSource, taxon: activeTaxon })
    fetch(`/api/observations?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        setFeatures(Array.isArray(json?.features) ? json.features : [])
        setMetadata(json?.metadata || null)
        setStatus('idle')
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setFeatures([])
        setMetadata(null)
        setStatus('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [activeSource, activeTaxon])

  // Keep the map's rendered points in sync with fetched features.
  useEffect(() => {
    syncObservations()
  }, [features, syncObservations])

  const handleSelectFeature = useCallback((feature) => {
    setSelectedFeature(feature)
    const map = mapRef.current
    const coords = feature?.geometry?.coordinates
    if (map && typeof map.flyTo === 'function' && Array.isArray(coords)) {
      map.flyTo({ center: coords, zoom: Math.max(map.getZoom?.() || DEFAULT_ZOOM, 8) })
    }
  }, [])

  const activeSourceObj = sources.find((s) => s.key === activeSource) || sources[0] || null
  const activeAttribution = metadata?.attribution || activeSourceObj?.attribution
  const listItems = features.slice(0, MAX_LIST_ITEMS)

  return (
    <section className="cl-map-section" aria-label="Observation map">
      <div className="cl-map-controls">
        <fieldset className="cl-taxon-filter">
          <legend className="fs-sm">Show recently observed</legend>
          <div className="cl-taxon-buttons" role="group" aria-label="Taxon group">
            {taxonKeys.map((key) => (
              <button
                key={key}
                type="button"
                className="cl-taxon-button"
                aria-pressed={key === activeTaxon}
                onClick={() => setActiveTaxon(key)}
              >
                {taxonGroups[key].label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="cl-source-select">
          <label htmlFor="cl-source" className="fs-sm">
            Data source
          </label>
          <select
            id="cl-source"
            value={activeSource}
            onChange={(e) => setActiveSource(e.target.value)}
          >
            {sources.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="cl-map-framing text-sm">
        These points show where people <strong>looked and reported</strong> — recent observations,
        not where a species lives. Absence of dots does not mean absence of the species.
      </p>

      <div className="cl-map-wrapper">
        <div ref={containerRef} className="cl-map" role="img" aria-label="Map of recent observations over the Ozark Highlands ecoregion" />
        {selectedFeature && (
          <ObservationCard feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
        )}
      </div>

      <div className="cl-map-status text-sm" role="status" aria-live="polite">
        {status === 'loading' && 'Loading recent observations…'}
        {status === 'error' && 'Could not load observations right now. Please try again later.'}
        {status === 'idle' &&
          `${features.length} recent observation${features.length === 1 ? '' : 's'} in view.`}
      </div>

      {listItems.length > 0 && (
        <details className="cl-obs-list-wrapper">
          <summary className="fs-sm">Browse observations as a list</summary>
          <ul className="cl-obs-list">
            {listItems.map((feature) => {
              const p = feature?.properties || {}
              const name = p.commonName || p.scientificName || 'Unknown species'
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className="cl-obs-list-item"
                    onClick={() => handleSelectFeature(feature)}
                  >
                    <span className="cl-obs-list-name">{name}</span>
                    {p.observedOn && <span className="cl-obs-list-date text-sm"> · {p.observedOn}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </details>
      )}

      <SourcesPanel
        activeSourceLabel={activeSourceObj?.label}
        activeSourceUrl={activeSourceObj?.homeUrl}
        activeAttribution={activeAttribution}
        baseAttributions={BASE_ATTRIBUTIONS}
        sourcesNote={sourcesNote}
      />
    </section>
  )
}

export default ChangingLandscapeMap
