import { resolveDocumentActions, resolveNewDocumentOptions } from './documentActionsPolicy'

/**
 * Stand-ins for Sanity's built-in document actions. This mirrors the default set
 * in sanity 5.31.1 (`publish`, `unpublish`, `discardChanges`, `duplicate`,
 * `delete`, `restore`) — every one of which mutates the document.
 *
 * It is a fixture, not a live read of Sanity's defaults, so it cannot notice a
 * new action arriving in a future version. That is exactly why the policy
 * returns an empty allowlist rather than filtering a blocklist: a new action is
 * excluded whether or not this fixture knows about it.
 */
const BUILT_IN_ACTIONS = [
  'publish',
  'unpublish',
  'discardChanges',
  'duplicate',
  'delete',
  'restore',
].map((action) => ({ action, label: action }))

const PRESENTATION_ACTION = { label: 'Open in Presentation' }

const actionNames = (actions) => actions.map((action) => action.action ?? action.label)

describe('studioGuide is view-only', () => {
  it('offers no document actions at all', () => {
    expect(resolveDocumentActions(BUILT_IN_ACTIONS, 'studioGuide', PRESENTATION_ACTION)).toEqual([])
  })

  it('excludes actions it has never heard of, not just the current built-ins', () => {
    // The real protection: Releases and Canvas contribute their own actions when
    // enabled. A blocklist would pass these through; an empty allowlist does not.
    const withFutureActions = [
      ...BUILT_IN_ACTIONS,
      { action: 'discardVersion', label: 'Discard version' },
      { action: 'editInCanvas', label: 'Edit in Canvas' },
      { action: 'someActionAddedInSanity6', label: 'Future action' },
    ]

    expect(resolveDocumentActions(withFutureActions, 'studioGuide', PRESENTATION_ACTION)).toEqual(
      [],
    )
  })

  it('is removed from the global new-document menu', () => {
    // Note: this covers the global "Create new" menu only. The Help & Guides list
    // pane reads its own inferred templates, cleared via initialValueTemplates([])
    // in sanity/structure/index.js — not exercised here.
    const templates = [{ templateId: 'studioGuide' }, { templateId: 'nativePlant' }]

    expect(resolveNewDocumentOptions(templates)).toEqual([{ templateId: 'nativePlant' }])
  })
})

describe('studioNote stays fully editable', () => {
  const resolved = resolveDocumentActions(BUILT_IN_ACTIONS, 'studioNote', PRESENTATION_ACTION)

  it('keeps publish and delete so editors own their notes', () => {
    expect(actionNames(resolved)).toEqual(expect.arrayContaining(['publish', 'delete']))
  })

  it('keeps every built-in action', () => {
    expect(actionNames(resolved)).toEqual(actionNames(BUILT_IN_ACTIONS))
  })

  it('can still be created from the new-document menu', () => {
    const templates = [{ templateId: 'studioNote' }]

    expect(resolveNewDocumentOptions(templates)).toEqual(templates)
  })
})

describe('existing types are unaffected by the studio-only policy', () => {
  it('still strips duplicate from welcomeSection and appends the presentation action', () => {
    const resolved = resolveDocumentActions(BUILT_IN_ACTIONS, 'welcomeSection', PRESENTATION_ACTION)

    expect(actionNames(resolved)).not.toContain('duplicate')
    expect(resolved[resolved.length - 1]).toBe(PRESENTATION_ACTION)
    expect(resolved).toHaveLength(BUILT_IN_ACTIONS.length) // one removed, one appended
  })

  it.each(['nativePlant', 'season', 'siteSettings', 'menu'])(
    'leaves %s actions untouched and appends the presentation action',
    (schemaType) => {
      const resolved = resolveDocumentActions(BUILT_IN_ACTIONS, schemaType, PRESENTATION_ACTION)

      expect(resolved).toEqual([...BUILT_IN_ACTIONS, PRESENTATION_ACTION])
    },
  )
})
