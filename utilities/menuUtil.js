import { stegaClean } from '@sanity/client/stega'

import { MONTH_NAMES_MAP } from './constants'
import { titleCase } from './helperUtil'

const DATE_TIME_ZONE = 'America/Chicago'
export const MAX_SEARCH_RESULTS = 8
export const MIN_BLOOMING_PLANTS_TO_SHOW = 2

const toArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  return value ? [value] : []
}

const monthAbbreviation = (monthNumber) => MONTH_NAMES_MAP.get(monthNumber)?.abbreviation ?? ''

/**
 * Returns the primary (first) common name of a plant, capitalized for display.
 * @param {{commonName?: string[]|string}} [plantName] - The plant's name object
 * @returns {string} The display name, or an empty string when none exists
 */
export const getPrimaryCommonName = (plantName) =>
  titleCase(toArray(plantName?.commonName)[0] ?? '')

/**
 * Formats flowering months for the menu: runs of three or more consecutive
 * months become a range ("Sep—Nov"), shorter runs a list ("Oct, Nov"). A run may
 * wrap the year end ("Nov—Jan"). Twelve months reads "All year".
 * @param {number[]} [months] - Month numbers 1-12, in any order
 * @returns {string} The formatted text, or an empty string when no valid month exists
 */
export const formatBloomMonths = (months = []) => {
  const sorted = [...new Set(months)].filter((m) => MONTH_NAMES_MAP.has(m)).sort((a, b) => a - b)
  if (sorted.length === 0) return ''
  if (sorted.length === 12) return 'All year'

  const runs = []
  sorted.forEach((month) => {
    const lastRun = runs[runs.length - 1]
    if (lastRun && month === lastRun[lastRun.length - 1] + 1) lastRun.push(month)
    else runs.push([month])
  })

  const firstRun = runs[0]
  const lastRun = runs[runs.length - 1]
  if (runs.length > 1 && firstRun[0] === 1 && lastRun[lastRun.length - 1] === 12) {
    runs.shift()
    lastRun.push(...firstRun)
  }

  return runs
    .map((run) =>
      run.length >= 3
        ? `${monthAbbreviation(run[0])}—${monthAbbreviation(run[run.length - 1])}`
        : run.map(monthAbbreviation).join(', '),
    )
    .join(', ')
}

/**
 * Formats an ISO timestamp as "Mon D" (e.g. "Oct 12"). The time zone is fixed so
 * the server render and the browser always agree, avoiding a hydration mismatch.
 * @param {string} isoDate - An ISO 8601 timestamp
 * @returns {string} The formatted date, or an empty string for a missing or invalid date
 */
export const formatAddedDate = (isoDate) => {
  const date = new Date(isoDate)
  if (!isoDate || Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: DATE_TIME_ZONE,
  })
}

const normalize = (text = '') =>
  text
    .toLowerCase()
    .replace(/[-\u2010-\u2015]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Scores how well a single name matches the query: 0 = name starts with it,
 * 1 = a word in the name starts with it, 2 = it appears inside the name,
 * -1 = no match.
 */
const scoreName = (name, query) => {
  const normalized = normalize(name)
  if (normalized.startsWith(query)) return 0
  if (normalized.split(' ').some((word) => word.startsWith(query))) return 1
  return normalized.includes(query) ? 2 : -1
}

/**
 * Searches the plant index by common and botanical name, including alternate
 * names. Results are ranked by match quality, then alphabetically.
 * Names may carry Visual Editing (stega) markers. Matching and sorting use cleaned
 * copies; the returned names keep the markers so they stay editable on screen.
 * @param {Array<{slug: string, commonName?: string[], botanicalName?: string[]}>} plants - Searchable plants
 * @param {string} query - What the visitor typed
 * @param {number} [limit=MAX_SEARCH_RESULTS] - Maximum number of results
 * @returns {Array<{slug: string, commonName: string, botanicalName: string, matchedName: string}>}
 *   `matchedName` is the alternate name that matched, or an empty string when the
 *   match was on a name already displayed
 */
export const searchPlants = (plants = [], query = '', limit = MAX_SEARCH_RESULTS) => {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []

  return plants
    .map((plant) => {
      const commonNames = toArray(plant.commonName)
      const botanicalNames = toArray(plant.botanicalName)
      const displayedNames = [commonNames[0], botanicalNames[0]]

      const matches = [...commonNames, ...botanicalNames]
        .map((name) => ({
          name,
          score: scoreName(stegaClean(name), normalizedQuery),
          isDisplayed: displayedNames.includes(name),
        }))
        .filter(({ score }) => score !== -1)
      if (matches.length === 0) return null

      const bestScore = Math.min(...matches.map(({ score }) => score))
      const matchedAlternate = matches
        .filter(({ isDisplayed }) => !isDisplayed)
        .sort((a, b) => a.score - b.score)[0]
      const matchedDisplayedName = matches.some(({ isDisplayed }) => isDisplayed)

      const commonName = titleCase(commonNames[0] ?? '')
      return {
        slug: stegaClean(plant.slug),
        commonName,
        sortName: stegaClean(commonName),
        botanicalName: botanicalNames[0] ?? '',
        matchedName: matchedDisplayedName ? '' : (matchedAlternate?.name ?? ''),
        score: bestScore,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.sortName.localeCompare(b.sortName))
    .slice(0, limit)
    .map(({ score: _score, sortName: _sortName, ...result }) => result)
}

/**
 * The sentence announced to screen readers (and shown above the results) for a search.
 * @param {number} resultCount - How many plants matched
 * @param {string} query - What the visitor typed
 * @returns {string} The status message, or an empty string when there is no search text
 */
export const getSearchStatusMessage = (resultCount, query = '') => {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return ''
  if (resultCount === 0) return `No plants found for "${trimmedQuery}"`
  return `${resultCount} ${resultCount === 1 ? 'plant' : 'plants'} found`
}
