import { defineMigration, at, patch, set } from 'sanity/migrate'

const WRONG = 'Savannah'
const RIGHT = 'Savanna'

/**
 * Corrects the `habitatType` picklist value "Savannah" (the Georgia city) to
 * "Savanna" (the habitat). The misspelling only ever existed in this one field —
 * body copy, image alt text, captions, asset keywords, and the "Savanna Blazing
 * Star" common name were all already spelled correctly.
 *
 * `habitatType` stores the literal string and the site renders it raw
 * (PlantImageCard joins the array straight onto the card) while the habitat
 * filter does an exact string compare (PlantListGrid `getMatched`). So the
 * schema/constants change is not viable on its own — without this migration the
 * plant cards keep reading "Savannah" and filtering by "Savanna" matches nothing.
 *
 * NOTE — deliberately does NOT exclude drafts or versions, against the usual
 * house rule in `.claude/skills/sanity-migrations/SKILL.md`. Two draft documents
 * and one content-release version carry the misspelling; filtering them out would
 * look clean now and silently reintroduce "Savannah" the moment that draft is
 * published or that release ships.
 *
 * Idempotent: the filter stops matching once the value is corrected, so re-runs
 * are a no-op and verification is just re-running the filter and expecting zero.
 *
 * Usage (dry-run is the default — review the patches before executing):
 *   npm run migrate:savanna-spelling:dry-run
 *   npm run migrate:savanna-spelling
 */
export default defineMigration({
  title: 'Fix Savannah -> Savanna habitat spelling',
  documentTypes: ['nativePlant'],
  filter: `"${WRONG}" in habitatType`,

  migrate: {
    document(doc) {
      const habitats = (doc.habitatType as string[] | undefined) ?? []
      if (!habitats.includes(WRONG)) return

      // Rebuild the whole array rather than patching by index — the misspelled
      // value sits at a different position in nearly every document.
      return patch(doc._id, [
        at('habitatType', set(habitats.map((habitat) => (habitat === WRONG ? RIGHT : habitat)))),
      ])
    },
  },
})
