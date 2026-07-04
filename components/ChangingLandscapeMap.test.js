/**
 * @jest-environment jsdom
 */

import React from 'react'

import { renderWithoutProviders, screen, fireEvent, waitFor } from '../tests/utils/test-utils'
import ChangingLandscapeMap from './ChangingLandscapeMap'

// MapLibre needs WebGL, which jsdom does not provide — mock it. The map's imperative
// side effects are exercised (load -> addSource/addLayer) but assert nothing here;
// the component's testable surface is its controls, list and card, driven by state.
jest.mock('maplibre-gl', () => {
  class MockMap {
    on(type, layerOrHandler, maybeHandler) {
      const handler = typeof maybeHandler === 'function' ? maybeHandler : layerOrHandler
      if (type === 'load' && typeof handler === 'function') handler()
    }
    addControl() {}
    addSource() {}
    addLayer() {}
    getSource() {
      return { setData: jest.fn() }
    }
    getCanvas() {
      return { style: {} }
    }
    getZoom() {
      return 6
    }
    flyTo() {}
    remove() {}
  }
  return { __esModule: true, default: { Map: MockMap, NavigationControl: class {} } }
})

const taxonGroups = {
  plants: { key: 'plants', label: 'Plants' },
  birds: { key: 'birds', label: 'Birds' },
}
const sources = [
  {
    key: 'inat',
    label: 'iNaturalist',
    homeUrl: 'https://www.inaturalist.org',
    attribution: 'iNat community',
  },
]

const featureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-92.1, 36.2] },
      properties: {
        id: 'inat-1',
        source: 'inat',
        commonName: 'Wild Bergamot',
        scientificName: 'Monarda fistulosa',
        observedOn: '2026-06-01',
        sourceUrl: 'https://www.inaturalist.org/observations/1',
        license: 'cc-by-nc',
        attribution: 'Observed by tester · iNaturalist (CC BY-NC)',
        photoUrl: null,
      },
    },
  ],
  metadata: {
    source: 'inat',
    sourceLabel: 'iNaturalist',
    attribution: 'iNat community',
    license: 'CC BY-NC',
    taxon: 'plants',
    count: 1,
  },
}

describe('ChangingLandscapeMap', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(featureCollection) }),
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders taxon filter buttons and a source selector', async () => {
    renderWithoutProviders(<ChangingLandscapeMap taxonGroups={taxonGroups} sources={sources} />)

    expect(screen.getByRole('button', { name: 'Plants' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Birds' })).toBeInTheDocument()
    expect(screen.getByLabelText('Data source')).toBeInTheDocument()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
  })

  it('fetches observations for the default taxon on mount', async () => {
    renderWithoutProviders(<ChangingLandscapeMap taxonGroups={taxonGroups} sources={sources} />)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
      expect(global.fetch.mock.calls[0][0]).toContain('taxon=plants')
      expect(global.fetch.mock.calls[0][0]).toContain('source=inat')
    })
    expect(await screen.findByText(/1 recent observation/)).toBeInTheDocument()
  })

  it('refetches when a different taxon group is selected', async () => {
    renderWithoutProviders(<ChangingLandscapeMap taxonGroups={taxonGroups} sources={sources} />)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: 'Birds' }))

    await waitFor(() => {
      const calledBirds = global.fetch.mock.calls.some(([url]) => url.includes('taxon=birds'))
      expect(calledBirds).toBe(true)
    })
  })

  it('shows the sources panel with the active attribution', async () => {
    renderWithoutProviders(
      <ChangingLandscapeMap taxonGroups={taxonGroups} sources={sources} sourcesNote="Not our claim." />,
    )
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(await screen.findByText('Not our claim.')).toBeInTheDocument()
    expect(screen.getByText(/Currently showing observations from/)).toBeInTheDocument()
  })

  it('opens an observation card when a list item is chosen', async () => {
    renderWithoutProviders(<ChangingLandscapeMap taxonGroups={taxonGroups} sources={sources} />)

    const listItem = await screen.findByRole('button', { name: /Wild Bergamot/ })
    fireEvent.click(listItem)

    const card = await screen.findByRole('dialog', { name: /Wild Bergamot/ })
    expect(card).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /source record/i })
    expect(link).toHaveAttribute('href', 'https://www.inaturalist.org/observations/1')
  })
})
