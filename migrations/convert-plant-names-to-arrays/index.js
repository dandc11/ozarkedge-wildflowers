/**
 * Migration: Convert plant names from comma-delimited strings to arrays
 *
 * This migration transforms plantName.commonName and plantName.botanicalName
 * from single string fields to arrays of strings.
 *
 * CRITICAL:
 * - Preserves name order (original name becomes first array item)
 * - Does NOT modify slug field (preserves all URLs)
 * - Excludes draft documents
 * - Only updates published documents
 *
 * Usage:
 *   npx sanity migration run convert-plant-names-to-arrays --dry-run
 *   npx sanity migration run convert-plant-names-to-arrays
 */

import { at, defineMigration, set } from 'sanity/migrate'

/**
 * Converts a comma-delimited string to a trimmed array
 * @param {string} nameString - The comma-delimited name string
 * @returns {string[]} - Array of trimmed name strings
 */
function splitAndTrimNames(nameString) {
  if (!nameString || typeof nameString !== 'string') {
    return []
  }

  return nameString
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
}

export default defineMigration({
  title: 'Convert plant names to arrays',
  documentTypes: ['nativePlant'],

  // Only migrate published documents (exclude drafts)
  filter: '!(_id in path("drafts.**"))',

  migrate: {
    document(doc) {
      const { plantName } = doc

      // Skip if plantName doesn't exist or is already in array format
      if (!plantName) {
        return
      }

      const { commonName, botanicalName } = plantName

      // Check if already arrays (migration already ran or data is correct)
      const commonNameIsArray = Array.isArray(commonName)
      const botanicalNameIsArray = Array.isArray(botanicalName)

      // If both are already arrays, no migration needed
      if (commonNameIsArray && botanicalNameIsArray) {
        console.log(`Skipping ${doc._id}: names already in array format`)
        return
      }

      // Build the update operations
      const operations = []

      // Convert commonName if it's a string
      if (!commonNameIsArray && typeof commonName === 'string') {
        const commonNameArray = splitAndTrimNames(commonName)
        if (commonNameArray.length > 0) {
          operations.push(at('plantName.commonName', set(commonNameArray)))
          console.log(
            `Converting commonName: "${commonName}" → [${commonNameArray.map((n) => `"${n}"`).join(', ')}]`,
          )
        } else {
          console.log(`WARNING: ${doc._id} has empty commonName after splitting`)
        }
      }

      // Convert botanicalName if it's a string
      if (!botanicalNameIsArray && typeof botanicalName === 'string') {
        const botanicalNameArray = splitAndTrimNames(botanicalName)
        if (botanicalNameArray.length > 0) {
          operations.push(at('plantName.botanicalName', set(botanicalNameArray)))
          console.log(
            `Converting botanicalName: "${botanicalName}" → [${botanicalNameArray.map((n) => `"${n}"`).join(', ')}]`,
          )
        } else {
          console.log(`WARNING: ${doc._id} has empty botanicalName after splitting`)
        }
      }

      // Return the operations (or undefined if no changes needed)
      return operations.length > 0 ? operations : undefined
    },
  },
})
