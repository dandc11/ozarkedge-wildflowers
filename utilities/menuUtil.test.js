/**
 * @jest-environment node
 */

// jest.setup.js replaces stegaClean with a no-op; these tests need the real one.
jest.unmock('@sanity/client/stega')

import { stegaClean } from '@sanity/client/stega'
// A transitive dependency of @sanity/client; used here to produce real Visual Editing markers.
import { vercelStegaCombine } from '@vercel/stega'

import {
  formatAddedDate,
  formatBloomMonths,
  getSearchStatusMessage,
  getPrimaryCommonName,
  searchPlants,
} from './menuUtil'

describe('menuUtil.js', () => {
  describe('getPrimaryCommonName', () => {
    it('uses the first entry and capitalizes the common name', () => {
      const plantName = {
        commonName: ['indian pink', 'pinkroot'],
        botanicalName: ['Spigelia marilandica'],
      }
      expect(getPrimaryCommonName(plantName)).toBe('Indian pink')
    })

    it('accepts a plain string and returns empty text when missing', () => {
      expect(getPrimaryCommonName({ commonName: 'false aloe' })).toBe('False aloe')
      expect(getPrimaryCommonName(undefined)).toBe('')
    })
  })

  describe('formatBloomMonths', () => {
    it.each([
      [[9, 10, 11], 'Sep—Nov'],
      [[8, 9, 10], 'Aug—Oct'],
      [[10, 11], 'Oct, Nov'],
      [[9, 10], 'Sep, Oct'],
      [[5], 'May'],
      [[11, 9, 10], 'Sep—Nov'],
      [[4, 5, 6, 9, 10], 'Apr—Jun, Sep, Oct'],
      [[11, 12, 1], 'Nov—Jan'],
      [[12, 1], 'Dec, Jan'],
      [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'All year'],
      [[], ''],
      [undefined, ''],
      [[0, 13, 7, 7], 'Jul'],
    ])('formats %j as %j', (months, expected) => {
      expect(formatBloomMonths(months)).toBe(expected)
    })
  })

  describe('formatAddedDate', () => {
    it('formats as "Mon D" in Central time', () => {
      expect(formatAddedDate('2026-10-12T15:00:00Z')).toBe('Oct 12')
    })

    it('uses the Central calendar day, not the UTC day', () => {
      expect(formatAddedDate('2026-10-13T02:00:00Z')).toBe('Oct 12')
    })

    it('returns empty text for missing or invalid input', () => {
      expect(formatAddedDate(undefined)).toBe('')
      expect(formatAddedDate('not a date')).toBe('')
    })
  })

  describe('searchPlants with Visual Editing markers', () => {
    const withStega = (text) => vercelStegaCombine(text, { origin: 'sanity.io', href: '/edit' })
    const plants = [
      {
        slug: withStega('indian-pink'),
        commonName: [withStega('indian pink'), withStega('pinkroot')],
        botanicalName: [withStega('Spigelia marilandica')],
      },
      {
        slug: withStega('false-aloe'),
        commonName: [withStega('false aloe')],
        botanicalName: [withStega('Manfreda virginica')],
      },
    ]

    it('matches and ranks as if the markers were not there', () => {
      const results = searchPlants(plants, 'pink')
      expect(results).toHaveLength(1)
      expect(stegaClean(results[0].matchedName)).toBe('')
      expect(searchPlants(plants, 'a').map(({ slug }) => slug)).toEqual([
        'false-aloe',
        'indian-pink',
      ])
    })

    it('keeps the markers on displayed names and cleans the slug', () => {
      const [result] = searchPlants(plants, 'pinkroot')
      expect(result.slug).toBe('indian-pink')
      expect(result.commonName).not.toBe('Indian pink')
      expect(stegaClean(result.commonName)).toBe('Indian pink')
      expect(result.botanicalName).toBe(plants[0].botanicalName[0])
      expect(stegaClean(result.matchedName)).toBe('pinkroot')
    })
  })

  describe('searchPlants', () => {
    const plants = [
      {
        slug: 'indian-pink',
        commonName: ['indian pink', 'pinkroot'],
        botanicalName: ['Spigelia marilandica'],
      },
      {
        slug: 'purple-coneflower',
        commonName: ['purple coneflower'],
        botanicalName: ['Echinacea purpurea'],
      },
      {
        slug: 'ozark-sunflower',
        commonName: ['ozark sunflower'],
        botanicalName: ['Helianthus silphioides'],
      },
      {
        slug: 'false-aloe',
        commonName: ['false aloe', 'rattlesnake master'],
        botanicalName: ['Manfreda virginica'],
      },
    ]

    it('returns nothing for an empty or whitespace query', () => {
      expect(searchPlants(plants, '')).toEqual([])
      expect(searchPlants(plants, '   ')).toEqual([])
    })

    it('matches common names case-insensitively', () => {
      expect(searchPlants(plants, 'INDIAN').map((r) => r.slug)).toEqual(['indian-pink'])
    })

    it('matches botanical names', () => {
      const [result] = searchPlants(plants, 'echinacea')
      expect(result).toMatchObject({
        slug: 'purple-coneflower',
        commonName: 'Purple coneflower',
        botanicalName: 'Echinacea purpurea',
        matchedName: '',
      })
    })

    it('reports the alternate name when only an alternate matched', () => {
      const [result] = searchPlants(plants, 'rattlesnake')
      expect(result.slug).toBe('false-aloe')
      expect(result.matchedName).toBe('rattlesnake master')
    })

    it('does not report an alternate when a displayed name matched too', () => {
      const [result] = searchPlants(plants, 'pink')
      expect(result.slug).toBe('indian-pink')
      expect(result.matchedName).toBe('')
    })

    it('ranks starts-with, then word-start, then substring matches', () => {
      const ranked = searchPlants(
        [
          { slug: 'c', commonName: ['upland aster'], botanicalName: ['x'] },
          { slug: 'b', commonName: ['purple aster'], botanicalName: ['y'] },
          { slug: 'a', commonName: ['aster'], botanicalName: ['z'] },
          { slug: 'd', commonName: ['bigasterish'], botanicalName: ['w'] },
        ],
        'aster',
      )
      expect(ranked.map((r) => r.slug)).toEqual(['a', 'b', 'c', 'd'])
    })

    it('limits the number of results', () => {
      const many = Array.from({ length: 20 }, (_, i) => ({
        slug: `aster-${i}`,
        commonName: [`aster ${i}`],
        botanicalName: [`Symphyotrichum ${i}`],
      }))
      expect(searchPlants(many, 'aster')).toHaveLength(8)
      expect(searchPlants(many, 'aster', 3)).toHaveLength(3)
    })

    it('treats hyphens as spaces so hyphenated names match typed spaces', () => {
      const vervain = [
        { slug: 'nlv', commonName: ['Narrow-Leaved Vervain'], botanicalName: ['Verbena simplex'] },
      ]
      expect(searchPlants(vervain, 'narrow leaved').map((r) => r.slug)).toEqual(['nlv'])
      expect(searchPlants(vervain, 'narrow-leaved vervain').map((r) => r.slug)).toEqual(['nlv'])
      expect(searchPlants(vervain, 'leaved').map((r) => r.slug)).toEqual(['nlv'])
    })

    it('returns an empty list when nothing matches', () => {
      expect(searchPlants(plants, 'zzz')).toEqual([])
    })

    it('tolerates plants with missing names', () => {
      expect(searchPlants([{ slug: 'x' }], 'a')).toEqual([])
    })
  })

  describe('getSearchStatusMessage', () => {
    it('describes results, singular and plural', () => {
      expect(getSearchStatusMessage(1, 'aloe')).toBe('1 plant found')
      expect(getSearchStatusMessage(3, 'milk')).toBe('3 plants found')
    })

    it('describes an empty search with the trimmed text', () => {
      expect(getSearchStatusMessage(0, '  zzz ')).toBe('No plants found for "zzz"')
    })

    it('is empty when there is no search text', () => {
      expect(getSearchStatusMessage(0, '')).toBe('')
      expect(getSearchStatusMessage(0, '   ')).toBe('')
    })
  })
})
