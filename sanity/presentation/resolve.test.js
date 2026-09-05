/**
 * Tests for the Presentation tool's document location config.
 *
 * `defineLocations` and `defineDocuments` only attach TypeScript types at build time —
 * at runtime they return their argument unchanged. Mocking them as identity functions
 * keeps the Studio bundle out of jsdom while still asserting against the real exported
 * config objects.
 */
jest.mock('sanity/presentation', () => ({
  defineLocations: (config) => config,
  defineDocuments: (documents) => documents,
}))

const { locations, mainDocuments } = require('./resolve')

// Sanity type-checks these keys when preparing a preview and rejects any non-scalar.
// A `select` map that targets array data through one of them breaks the whole entry.
const RESERVED_PREVIEW_KEYS = ['title', 'subtitle', 'description', 'imageUrl', 'date']

describe('nativePlant location', () => {
  const { select, resolve } = locations.nativePlant

  // The regression guard for #332: selecting the botanical-name array as `title`
  // made Sanity discard the entire selection, breaking both the label and the href.
  // Asserted one key at a time — a single `not.arrayContaining` over the whole list
  // would pass as soon as any one key were absent, which is always true here.
  it.each(RESERVED_PREVIEW_KEYS)('does not select into the reserved key %s', (key) => {
    expect(Object.keys(select)).not.toContain(key)
  })

  it('uses the first botanical name when the field is an array', () => {
    expect(
      resolve({ botanicalName: ['Manfreda virginica'], slug: 'false-aloe-manfreda-virginica' }),
    ).toEqual({
      locations: [
        {
          title: 'Manfreda virginica',
          href: '/native-plants/false-aloe-manfreda-virginica',
        },
      ],
    })
  })

  it('accepts a bare string botanical name', () => {
    expect(resolve({ botanicalName: 'Manfreda virginica', slug: 'false-aloe' })).toEqual({
      locations: [{ title: 'Manfreda virginica', href: '/native-plants/false-aloe' }],
    })
  })

  it('falls back to a generic label when the botanical name is missing', () => {
    expect(resolve({ botanicalName: [], slug: 'some-plant' })).toEqual({
      locations: [{ title: 'Native Plant', href: '/native-plants/some-plant' }],
    })
  })

  it('returns no locations when the document has no slug', () => {
    expect(resolve({ botanicalName: ['Manfreda virginica'] })).toEqual({ locations: [] })
    expect(resolve(null)).toEqual({ locations: [] })
  })
})

describe('season location', () => {
  // Season selects a plain string field, so it was unaffected by #332. This is the
  // control: it must keep working.
  it('links to the season page', () => {
    expect(locations.season.resolve({ title: 'spring', slug: 'spring' })).toEqual({
      locations: [{ title: 'spring', href: '/season/spring' }],
    })
  })
})

describe('static locations', () => {
  it.each([
    ['landingPage', '/'],
    ['aboutPage', '/about'],
    ['plantListPage', '/native-plants'],
  ])('%s points at %s', (type, href) => {
    expect(locations[type].locations).toEqual([expect.objectContaining({ href })])
  })

  it('does not carry a select map on entries with hardcoded locations', () => {
    // A `select` here is dead config: these entries never read the selection, so a
    // field path typo'd into it fails silently.
    expect(locations.landingPage.select).toBeUndefined()
    expect(locations.aboutPage.select).toBeUndefined()
    expect(locations.plantListPage.select).toBeUndefined()
  })
})

describe('mainDocuments routes', () => {
  it('maps every rendered route to a document type', () => {
    expect(mainDocuments.map(({ route }) => route)).toEqual(
      expect.arrayContaining([
        '/',
        '/about',
        '/native-plants',
        '/native-plants/:slug',
        '/season/:slug',
      ]),
    )
  })
})
