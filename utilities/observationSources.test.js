/**
 * @jest-environment node
 */

import {
  DEFAULT_BBOX,
  OBSERVATION_SOURCES,
  TAXON_GROUPS,
  parseBbox,
} from './observationSources'

describe('observationSources', () => {
  describe('parseBbox', () => {
    it('returns the default bbox when nothing is passed', () => {
      expect(parseBbox(null)).toEqual(DEFAULT_BBOX)
      expect(parseBbox('')).toEqual(DEFAULT_BBOX)
    })

    it('parses a valid "swlng,swlat,nelng,nelat" string', () => {
      expect(parseBbox('-94.6,35.0,-90.4,37.6')).toEqual({
        swlng: -94.6,
        swlat: 35.0,
        nelng: -90.4,
        nelat: 37.6,
      })
    })

    it('falls back to the default bbox on malformed input', () => {
      expect(parseBbox('not,a,bbox')).toEqual(DEFAULT_BBOX)
      expect(parseBbox('1,2,3')).toEqual(DEFAULT_BBOX)
    })
  })

  describe('registry', () => {
    it('registers iNaturalist as an enabled source with a fetch function', () => {
      expect(OBSERVATION_SOURCES.inat.enabled).toBe(true)
      expect(typeof OBSERVATION_SOURCES.inat.fetchFn).toBe('function')
    })

    it('keeps GBIF registered but disabled for the MVP', () => {
      expect(OBSERVATION_SOURCES.gbif.enabled).toBe(false)
    })

    it('maps taxon groups to iNaturalist iconic_taxa', () => {
      expect(TAXON_GROUPS.plants.inat.iconic_taxa).toBe('Plantae')
      expect(TAXON_GROUPS.birds.inat.iconic_taxa).toBe('Aves')
      expect(TAXON_GROUPS.pollinators.inat.iconic_taxa).toBe('Insecta')
    })
  })

  describe('iNaturalist fetchFn', () => {
    afterEach(() => jest.restoreAllMocks())

    it('builds a bounded, research-grade query and normalizes results', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [
                {
                  id: 7,
                  taxon: { name: 'Echinacea pallida', preferred_common_name: 'Pale Purple Coneflower' },
                  observed_on: '2026-05-20',
                  geojson: { type: 'Point', coordinates: [-93.0, 36.0] },
                  uri: 'https://www.inaturalist.org/observations/7',
                  license_code: 'cc-by',
                  user: { login: 'botanist' },
                },
              ],
            }),
        }),
      )

      const features = await OBSERVATION_SOURCES.inat.fetchFn({
        taxonGroup: TAXON_GROUPS.plants,
        bbox: DEFAULT_BBOX,
      })

      const url = global.fetch.mock.calls[0][0]
      expect(url).toContain('quality_grade=research')
      expect(url).toContain('iconic_taxa=Plantae')
      expect(url).toContain('swlat=35')

      expect(features).toHaveLength(1)
      expect(features[0].properties.id).toBe('inat-7')
      expect(features[0].properties.commonName).toBe('Pale Purple Coneflower')
    })

    it('throws when the upstream response is not ok', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 429 }))
      await expect(
        OBSERVATION_SOURCES.inat.fetchFn({ taxonGroup: TAXON_GROUPS.birds, bbox: DEFAULT_BBOX }),
      ).rejects.toThrow(/iNaturalist/i)
    })
  })
})
