/**
 * Which document actions each schema type is allowed, resolved as a pure function
 * so the policy can be unit-tested without booting a Studio.
 *
 * `sanity.config.js` wires this into `defineConfig({ document: { ... } })`.
 * `OpenInPresentationAction` is passed in rather than imported here, to keep this
 * module free of Studio and icon imports.
 */

/**
 * `studioGuide` is offered no document actions at all.
 *
 * This is an allowlist of nothing rather than a blocklist of today's write
 * actions. Every built-in action in sanity 5.31.1 mutates the document —
 * `publish`, `unpublish`, `discardChanges`, `duplicate`, `delete`, `restore` —
 * so there is nothing to keep; and an empty list also excludes actions that
 * arrive later. Releases contributes `discardVersion` and `unpublishVersion`,
 * and Canvas contributes `editInCanvas` and `linkToCanvas`; a blocklist would
 * silently let those through the moment either feature is enabled.
 *
 * If a genuinely non-mutating action is ever worth showing here, add it
 * explicitly rather than switching back to filtering.
 */
const STUDIO_GUIDE_ACTIONS = []

/**
 * @param {Array<{action?: string}>} prev - the actions Sanity offers for this type
 * @param {string} schemaType
 * @param {unknown} openInPresentationAction - appended for types with a frontend route
 * @returns {Array<unknown>}
 */
export const resolveDocumentActions = (prev, schemaType, openInPresentationAction) => {
  // Read-only help documentation. No presentation action either — Studio-only
  // types have no frontend route to preview.
  if (schemaType === 'studioGuide') {
    return STUDIO_GUIDE_ACTIONS
  }

  // The editor's own notes stay fully editable, creatable and publishable.
  if (schemaType === 'studioNote') {
    return prev
  }

  const actions =
    schemaType === 'welcomeSection' ? prev.filter((action) => action.action !== 'duplicate') : prev

  return [...actions, openInPresentationAction]
}

/**
 * Guides are seeded by scripts/seed-studio-guides.mjs, not authored in the Studio.
 * This removes `studioGuide` from the global "create new" menu; the Help & Guides
 * list pane is handled separately, by `initialValueTemplates([])` in
 * sanity/structure/index.js, which that pane reads instead of this resolver.
 *
 * @param {Array<{templateId: string}>} prev
 * @returns {Array<{templateId: string}>}
 */
export const resolveNewDocumentOptions = (prev) =>
  prev.filter((template) => template.templateId !== 'studioGuide')
