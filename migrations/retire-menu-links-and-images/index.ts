import { defineMigration, at, unset } from 'sanity/migrate'

const RETIRED_FIELDS = ['menuBackgroundImage', 'mobileMenuBackgroundImage', 'menuItems'] as const

/**
 * Removes the retired fields from the `menu` document. The menu now only stores
 * a featured plant and note; its links are hard-coded in `components/Nav.js` and
 * the background photos are gone from the design.
 *
 * Run AFTER the Studio and schema deploy, so the editor never sees the old
 * values as "unknown fields" in the meantime. Drafts and versions are included
 * on purpose: a draft that still carries the old fields would bring them back
 * the moment it is published.
 *
 * Idempotent: the filter stops matching once the fields are gone.
 *
 * Usage (dry-run is the default; review the patches before executing):
 *   npm run migrate:retire-menu-fields:dry-run
 *   npm run migrate:retire-menu-fields
 */
export default defineMigration({
  title: 'Remove retired links and background images from the menu document',
  documentTypes: ['menu'],
  filter: RETIRED_FIELDS.map((field) => `defined(${field})`).join(' || '),

  migrate: {
    document(doc) {
      const present = RETIRED_FIELDS.filter((field) => field in doc)
      if (present.length === 0) return

      return present.map((field) => at(field, unset()))
    },
  },
})
