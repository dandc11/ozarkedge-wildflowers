import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { STUDIO_GUIDES, buildBody, screenshotFiles } from './studio-guides-content.mjs'

const ASSET_DIR = join(dirname(__filename), 'studio-guide-assets')

/**
 * Portable Text fails in quiet ways — a duplicated `_key` corrupts the block
 * editor, a `figure` without `alt` blocks publishing, a screenshot naming a file
 * that isn't there breaks the seed run. All of these are easy to introduce while
 * editing prose and invisible until someone opens the Studio.
 */
describe('studio guide content', () => {
  it('has guides to check', () => {
    // Guards the guard: every it.each below iterates STUDIO_GUIDES.
    expect(STUDIO_GUIDES.length).toBeGreaterThan(0)
  })

  it('gives every guide a unique id and order', () => {
    const ids = STUDIO_GUIDES.map((guide) => guide.id)
    const orders = STUDIO_GUIDES.map((guide) => guide.order)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(orders).size).toBe(orders.length)
  })

  it.each(STUDIO_GUIDES.map((guide) => [guide.title, guide]))('%s is valid', (_title, guide) => {
    const body = buildBody(guide.body, { 'any.png': 'image-stub' })

    expect(body.length).toBeGreaterThan(0)
    expect(new Set(body.map((block) => block._key)).size).toBe(body.length)

    body.forEach((block) => {
      expect(block._key).toBeTruthy()

      if (block._type === 'figure') {
        // The figure schema marks alt as required, so a missing one only shows up
        // as a validation error in the Studio, after the guide is already seeded.
        expect(block.alt).toBeTruthy()
        return
      }

      expect(block._type).toBe('block')
      expect(Array.isArray(block.markDefs)).toBe(true)
      expect(block.children.length).toBeGreaterThan(0)
      expect(new Set(block.children.map((span) => span._key)).size).toBe(block.children.length)

      block.children.forEach((span) => {
        expect(span._type).toBe('span')
        expect(span.text).toBeTruthy()
        // Any surviving asterisk means the markup splitter didn't match and the
        // raw `*`/`**` would render literally to the reader. Checking for `**`
        // alone missed italics entirely, which shipped as visible asterisks.
        expect(span.text).not.toContain('*')
      })
    })
  })

  it('references only screenshots that exist on disk', () => {
    const files = screenshotFiles(STUDIO_GUIDES)

    files.forEach((file) => {
      expect(existsSync(join(ASSET_DIR, file))).toBe(true)
    })
  })

  it('builds the same output every run, so re-seeding is a no-op', () => {
    const once = JSON.stringify(STUDIO_GUIDES.map((g) => buildBody(g.body)))
    const twice = JSON.stringify(STUDIO_GUIDES.map((g) => buildBody(g.body)))

    expect(once).toBe(twice)
  })
})
