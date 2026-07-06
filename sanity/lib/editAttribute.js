import { createDataAttribute } from 'next-sanity'

/**
 * Build a `data-sanity` edit-target string so Visual Editing overlays resolve
 * to a specific document field. Non-text content (images, videos) carries no
 * stega markers of its own, so it needs this attribute to be clickable in
 * Presentation. Returns undefined when context is missing, so the attribute is
 * omitted rather than rendered empty.
 *
 * @param {string} id - document `_id`
 * @param {string} type - document `_type`
 * @param {string} path - field path, e.g. `mainImage` or `body[_key=="abc123"]`
 * @returns {string|undefined}
 */
export const editAttribute = (id, type, path) =>
  id && type && path ? createDataAttribute({ id, type, path }).toString() : undefined
