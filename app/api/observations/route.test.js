/**
 * @jest-environment node
 */

import { GET } from './route'

const makeRequest = (query = '') => new Request(`http://localhost/api/observations${query}`)

const inatResponse = {
  results: [
    {
      id: 1,
      taxon: { name: 'Monarda fistulosa', preferred_common_name: 'Wild Bergamot' },
      observed_on: '2026-06-01',
      geojson: { type: 'Point', coordinates: [-92.1, 36.2] },
      uri: 'https://www.inaturalist.org/observations/1',
      license_code: 'cc-by-nc',
      photos: [{ url: 'https://static.inaturalist.org/photos/1/square.jpg' }],
      user: { login: 'tester' },
    },
    {
      // Record without geometry should be dropped during normalization
      id: 2,
      taxon: { name: 'Asclepias tuberosa', preferred_common_name: 'Butterfly Milkweed' },
      observed_on: '2026-06-02',
      geojson: null,
      user: { login: 'tester2' },
    },
  ],
}

describe('GET /api/observations', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(inatResponse) }),
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns a normalized GeoJSON FeatureCollection from iNaturalist', async () => {
    const res = await GET(makeRequest('?source=inat&taxon=plants'))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.type).toBe('FeatureCollection')
    // The record without geometry is filtered out
    expect(body.features).toHaveLength(1)

    const feature = body.features[0]
    expect(feature.type).toBe('Feature')
    expect(feature.geometry).toEqual({ type: 'Point', coordinates: [-92.1, 36.2] })
    expect(feature.properties).toMatchObject({
      source: 'inat',
      scientificName: 'Monarda fistulosa',
      commonName: 'Wild Bergamot',
      observedOn: '2026-06-01',
      sourceUrl: 'https://www.inaturalist.org/observations/1',
      license: 'cc-by-nc',
    })
    expect(feature.properties.attribution).toContain('tester')
  })

  it('includes source metadata for attribution', async () => {
    const res = await GET(makeRequest('?source=inat&taxon=birds'))
    const body = await res.json()
    expect(body.metadata).toMatchObject({
      source: 'inat',
      sourceLabel: 'iNaturalist',
      license: 'CC BY-NC',
      taxon: 'birds',
      count: 1,
    })
  })

  it('passes the taxon group iconic_taxa to the iNaturalist request', async () => {
    await GET(makeRequest('?source=inat&taxon=birds'))
    const calledUrl = global.fetch.mock.calls[0][0]
    expect(calledUrl).toContain('iconic_taxa=Aves')
  })

  it('sets a Cache-Control header', async () => {
    const res = await GET(makeRequest('?source=inat&taxon=plants'))
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=3600')
  })

  it('rejects an unknown source with 400', async () => {
    const res = await GET(makeRequest('?source=bogus&taxon=plants'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/source/i)
  })

  it('rejects a disabled source (gbif) with 400', async () => {
    const res = await GET(makeRequest('?source=gbif&taxon=plants'))
    expect(res.status).toBe(400)
  })

  it('rejects an unknown taxon group with 400', async () => {
    const res = await GET(makeRequest('?source=inat&taxon=bogus'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/taxon/i)
  })

  it('returns 502 when the upstream request fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500 }))
    const res = await GET(makeRequest('?source=inat&taxon=plants'))
    expect(res.status).toBe(502)
  })
})
