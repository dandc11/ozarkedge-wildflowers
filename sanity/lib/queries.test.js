import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { DOCUMENT_TYPES } from '../../schemas/constants/constants'

const ROOT = join(__dirname, '..', '..')
const read = (relativePath) => readFileSync(join(ROOT, relativePath), 'utf8')

/**
 * The frontend's only sanctioned data-access surface. CLAUDE.md requires every
 * GROQ query to be centralised in these two files and fetched through
 * `sanityFetch`, so a Studio-only type can only reach the site by appearing here.
 */
const FRONTEND_QUERY_FILES = ['sanity/lib/queries.js', 'sanity/lib/queryFragments.js']

/**
 * `studioGuide`, `studioGuideBody` and `studioNote` are internal Studio
 * documentation and must never be queried by or rendered on the public site.
 *
 * Type names are read out of the generated `schema.json` rather than hardcoded,
 * so renaming a type cannot quietly reduce these assertions to grepping for a
 * string that nothing uses any more.
 */
describe('Studio-only types stay out of the frontend', () => {
  const schemaTypeNames = JSON.parse(read('schema.json')).map((type) => type.name)
  const studioOnlyTypeNames = schemaTypeNames.filter((name) => name.startsWith('studio'))

  it('finds the Studio-only types in the generated schema', () => {
    // Guards the guard: every assertion below iterates this list, so an empty
    // list would let them all pass while checking nothing at all. If this fails
    // because a type was renamed off the `studio*` prefix, update the convention
    // here rather than deleting the check.
    expect(studioOnlyTypeNames).toEqual(
      expect.arrayContaining(['studioGuide', 'studioGuideBody', 'studioNote']),
    )
  })

  it.each(FRONTEND_QUERY_FILES)('%s references no Studio-only type', (file) => {
    const source = read(file)

    expect(source.length).toBeGreaterThan(0)
    studioOnlyTypeNames.forEach((name) => {
      expect(source).not.toContain(name)
    })
  })

  it('excludes Studio-only types from internal link targets', () => {
    // DOCUMENT_TYPES backs the `internalLink` annotation's reference field. A
    // Studio-only type appearing here would let an editor link site content to a
    // help page, which would then have to resolve on the frontend.
    const linkableTypes = DOCUMENT_TYPES.map((entry) => entry.type)

    expect(linkableTypes.length).toBeGreaterThan(0)
    studioOnlyTypeNames.forEach((name) => {
      expect(linkableTypes).not.toContain(name)
    })
  })
})
