/**
 * @jest-environment node
 */

import {
  getPathFromDocType,
  getCurrentMonthName,
  getCurrentMonthNumber,
  getSeasonFromMonthNumber,
} from './helperUtil'

// Mock constants to ensure predictable test results
jest.mock('./constants', () => ({
  DOCTYPE_PATH_PREFIXES: {
    nativePlant: '/native-plants/',
    season: '/season/',
    aboutPage: '/about',
    landingPage: '/',
    plantListPage: '/plants',
    pollinator: '/pollinator/',
  },
  MONTH_NAMES_MAP: new Map([
    [1, { fullName: 'January', abbreviation: 'Jan' }],
    [2, { fullName: 'February', abbreviation: 'Feb' }],
    [3, { fullName: 'March', abbreviation: 'Mar' }],
    [4, { fullName: 'April', abbreviation: 'Apr' }],
    [5, { fullName: 'May', abbreviation: 'May' }],
    [6, { fullName: 'June', abbreviation: 'Jun' }],
    [7, { fullName: 'July', abbreviation: 'Jul' }],
    [8, { fullName: 'August', abbreviation: 'Aug' }],
    [9, { fullName: 'September', abbreviation: 'Sep' }],
    [10, { fullName: 'October', abbreviation: 'Oct' }],
    [11, { fullName: 'November', abbreviation: 'Nov' }],
    [12, { fullName: 'December', abbreviation: 'Dec' }],
  ]),
  SEASONS: {
    SPRING: {
      SEASON_NAME: 'spring',
      SEASON_MONTHS: [3, 4, 5],
      ACCENT_COLOR_VAR: '--spring-accent',
      BG_COLOR_VAR: '--oe-green-300',
      BG_GRADIENT_VAR: '--spring-gradient',
    },
    SUMMER: {
      SEASON_NAME: 'summer',
      SEASON_MONTHS: [6, 7, 8],
      ACCENT_COLOR_VAR: '--summer-accent',
      BG_COLOR_VAR: '--summer-bg-color',
      BG_GRADIENT_VAR: '--summer-gradient',
    },
    FALL: {
      SEASON_NAME: 'fall',
      SEASON_MONTHS: [9, 10, 11],
      ACCENT_COLOR_VAR: '--fall-accent',
      BG_COLOR_VAR: '--fall-bg-color',
      BG_GRADIENT_VAR: '--fall-gradient',
    },
    WINTER: {
      SEASON_NAME: 'winter',
      SEASON_MONTHS: [12, 1, 2],
      ACCENT_COLOR_VAR: '--winter-accent',
      BG_COLOR_VAR: '--oe-blue-dark-100',
      BG_GRADIENT_VAR: '--winter-gradient',
    },
  },
}))

describe('helperUtil.js', () => {
  describe('getPathFromDocType', () => {
    it('returns correct path for native plant with slug', () => {
      const result = getPathFromDocType('nativePlant', 'wild-bergamot')
      expect(result).toBe('/native-plants/wild-bergamot')
    })

    it('returns correct path for season with slug', () => {
      const result = getPathFromDocType('season', 'spring')
      expect(result).toBe('/season/spring')
    })

    it('returns correct path for about page', () => {
      const result = getPathFromDocType('aboutPage', '')
      expect(result).toBe('/about')
    })

    it('returns correct path for landing page', () => {
      const result = getPathFromDocType('landingPage', '')
      expect(result).toBe('/')
    })

    it('returns slug when doctype is not in prefixes', () => {
      const result = getPathFromDocType('unknownType', 'some-slug')
      expect(result).toBe('some-slug')
    })

    it('handles empty parameters', () => {
      const result = getPathFromDocType('', '')
      expect(result).toBe('')
    })

    it('handles missing slug parameter', () => {
      const result = getPathFromDocType('nativePlant')
      expect(result).toBe('/native-plants/')
    })

    it('handles missing doctype parameter', () => {
      const result = getPathFromDocType(undefined, 'some-slug')
      expect(result).toBe('some-slug')
    })
  })

  describe('getCurrentMonthName', () => {
    beforeEach(() => {
      // Mock Date to return a predictable date
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns correct month name for January', () => {
      jest.setSystemTime(new Date('2024-01-15'))
      const result = getCurrentMonthName()
      expect(result).toBe('January')
    })

    it('returns correct month name for June', () => {
      jest.setSystemTime(new Date('2024-06-15'))
      const result = getCurrentMonthName()
      expect(result).toBe('June')
    })

    it('returns correct month name for December', () => {
      jest.setSystemTime(new Date('2024-12-15'))
      const result = getCurrentMonthName()
      expect(result).toBe('December')
    })
  })

  describe('getCurrentMonthNumber', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns correct month number for January', () => {
      jest.setSystemTime(new Date('2024-01-15'))
      const result = getCurrentMonthNumber()
      expect(result).toBe(1)
    })

    it('returns correct month number for June', () => {
      jest.setSystemTime(new Date('2024-06-15'))
      const result = getCurrentMonthNumber()
      expect(result).toBe(6)
    })

    it('returns correct month number for December', () => {
      jest.setSystemTime(new Date('2024-12-15'))
      const result = getCurrentMonthNumber()
      expect(result).toBe(12)
    })
  })

  describe('getSeasonFromMonthNumber', () => {
    it('returns spring for March', () => {
      const result = getSeasonFromMonthNumber(3)
      expect(result).toEqual({
        SEASON_NAME: 'spring',
        SEASON_MONTHS: [3, 4, 5],
        ACCENT_COLOR_VAR: expect.any(String),
        BG_COLOR_VAR: expect.any(String),
        BG_GRADIENT_VAR: expect.any(String),
      })
    })

    it('returns spring for April', () => {
      const result = getSeasonFromMonthNumber(4)
      expect(result?.SEASON_NAME).toBe('spring')
    })

    it('returns spring for May', () => {
      const result = getSeasonFromMonthNumber(5)
      expect(result?.SEASON_NAME).toBe('spring')
    })

    it('returns summer for June', () => {
      const result = getSeasonFromMonthNumber(6)
      expect(result?.SEASON_NAME).toBe('summer')
    })

    it('returns summer for July', () => {
      const result = getSeasonFromMonthNumber(7)
      expect(result?.SEASON_NAME).toBe('summer')
    })

    it('returns summer for August', () => {
      const result = getSeasonFromMonthNumber(8)
      expect(result?.SEASON_NAME).toBe('summer')
    })

    it('returns fall for September', () => {
      const result = getSeasonFromMonthNumber(9)
      expect(result?.SEASON_NAME).toBe('fall')
    })

    it('returns fall for October', () => {
      const result = getSeasonFromMonthNumber(10)
      expect(result?.SEASON_NAME).toBe('fall')
    })

    it('returns fall for November', () => {
      const result = getSeasonFromMonthNumber(11)
      expect(result?.SEASON_NAME).toBe('fall')
    })

    it('returns winter for December', () => {
      const result = getSeasonFromMonthNumber(12)
      expect(result?.SEASON_NAME).toBe('winter')
    })

    it('returns winter for January', () => {
      const result = getSeasonFromMonthNumber(1)
      expect(result?.SEASON_NAME).toBe('winter')
    })

    it('returns winter for February', () => {
      const result = getSeasonFromMonthNumber(2)
      expect(result?.SEASON_NAME).toBe('winter')
    })

    it('returns undefined for invalid month number', () => {
      const result = getSeasonFromMonthNumber(13)
      expect(result).toBeUndefined()
    })

    it('returns undefined for zero', () => {
      const result = getSeasonFromMonthNumber(0)
      expect(result).toBeUndefined()
    })

    it('returns undefined for negative number', () => {
      const result = getSeasonFromMonthNumber(-1)
      expect(result).toBeUndefined()
    })

    it('handles undefined input', () => {
      const result = getSeasonFromMonthNumber()
      expect(result).toBeUndefined()
    })

    it('handles null input', () => {
      const result = getSeasonFromMonthNumber(null)
      expect(result).toBeUndefined()
    })
  })
})
