import { MONTH_NAMES_MAP } from './constants'
import { SEASONS } from './constants'
import { DOCTYPE_PATH_PREFIXES } from './constants'

/**
 * Returns the path for a given document type and slug
 * @param {string} [doctype=''] - The document type
 * @param {string} [slug=''] - The slug
 * @returns {string} The path for the given document type and slug
 */
export const getPathFromDocType = (doctype = '', slug = '') => {
  return DOCTYPE_PATH_PREFIXES[doctype] ? DOCTYPE_PATH_PREFIXES[doctype] + slug : slug
}
/**
 * Returns the full name of the current month
 * @returns {string} The full name of the current month
 */
export const getCurrentMonthName = () => {
  const CURRENT_MONTH_NAME = new Date(Date.now()).getMonth() + 1
  return MONTH_NAMES_MAP.get(CURRENT_MONTH_NAME).fullName
}

/**
 * Returns the current month number
 * @returns {number} The current month number
 */
export const getCurrentMonthNumber = () => {
  const CURRENT_MONTH_NUMBER = new Date(Date.now()).getMonth() + 1
  return CURRENT_MONTH_NUMBER
}

/**
 * Returns the season for a given month number
 * @param {number} [monthNum=0] - The month number
 * @returns {object|undefined} The season object for the given month number, or undefined if not found
 */
export const getSeasonFromMonthNumber = (monthNum) => {
  let season
  for (const testSeason in SEASONS) {
    season = SEASONS[testSeason]
    if (season.SEASON_MONTHS.includes(monthNum)) {
      return season
    }
  }
}

/**
 * Returns the month numbers for a given season
 * @param {string} [season=''] - The season
 * @returns {array|undefined} The month numbers for the given season, or undefined if not found
 * */
export const getMonthNumbersFromSeason = (season) => {
  let currentTestSeason
  for (const testSeason in SEASONS) {
    currentTestSeason = SEASONS[testSeason]
    if (currentTestSeason.SEASON_NAME === season) {
      return currentTestSeason.SEASON_MONTHS
    }
  }
  return []
}

/**
 * Returns the full name of a month from its number
 * @param {number} [monthNum=0] - The month number
 * @returns {string|undefined} The full name of the month, or undefined if not found
 */
export const getMonthNameFromMonthNumber = (monthNum) => {
  return MONTH_NAMES_MAP.get(monthNum)
}

/**
 * Inserts an ellipsis at the end of a string
 * @param {string} [text=''] - A text string to be truncated
 * @param {number} [charLimit=1000000] - The maximum character length of the string, after which the ellipsis should be inserted
 * @returns {string} A truncated string
 */
export const truncateText = (text = '', charLimit = 1000000) => {
  let ellipsis = <span className="tracking-tighter">...</span>
  let truncatedText = ''
  if (text.length > charLimit) {
    truncatedText = <>text.substring(0, charLimit) + ellipsis</>
  }
  return truncatedText
}

/**
 * Returns the background color and text color variables for a given conservation ranking
 * @param {string} conservationRanking - The conservation ranking
 * @returns {object} An object containing the background color variable, text color variable, and ranking text
 */
export const getNatureServeRankingColors = (conservationRanking) => {
  let bgColorVariable
  let textLight = true
  let textColorVariable = '--oe-white'
  let rankingText

  switch (conservationRanking) {
    case 'presumedExtirpated':
      bgColorVariable = '--oe-presumed-extirpated'
      rankingText = 'Presumed Extirpated'
      break
    case 'possiblyExtirpated':
      bgColorVariable = '--oe-possibly-extirpated'
      rankingText = 'Possibly Extirpated'
      break
    case 'criticallyImperiled':
      bgColorVariable = '--oe-critically-imperiled'
      rankingText = 'Critically Imperiled'
      break
    case 'imperiled':
      bgColorVariable = '--oe-imperiled'
      rankingText = 'Imperiled'
      textLight = false
      break
    case 'vulnerable':
      bgColorVariable = '--oe-vulnerable'
      rankingText = 'Vulnerable'
      textLight = false
      break
    case 'apparentlySecure':
      bgColorVariable = '--oe-apparently-secure'
      rankingText = 'Apparently Secure'
      textLight = false
      break
    case 'secure':
      bgColorVariable = '--oe-secure'
      rankingText = 'Secure'
      break
    default:
      bgColorVariable = '--oe-gray-300'
      textLight = false
      rankingText = 'Not Ranked'
      break
  }
  if (!textLight) {
    textColorVariable = '--oe-black'
  }
  return { bgColorVariable, textColorVariable, rankingText }
}

/**
 * Capitalizes the first character in a string
 * @param {string} [textString=''] - The string to be capitalized
 * @returns {string} A capitalized string
 */
export const titleCase = (textString = '') =>
  textString.charAt(0).toUpperCase() + textString.slice(1)

export const getSeasonObject = (season) => {
  console.log('season:', season)
  const seasonObject = Object.values(SEASONS).find((s) => s.SEASON_NAME === season)
  return seasonObject
}

/**
 * Returns the current season
 * @returns {object} The current season
 */
export const getCurrentSeason = () => getSeasonFromMonthNumber(getCurrentMonthNumber())

/**
 * Destructures a feature object and returns relevant properties.
 * @param {object} feature - The feature object to be destructured.
 * @param {string} feature._type - The type of the feature.
 * @param {boolean} feature.pullTextFromLink - Flag indicating whether to pull text from the link.
 * @param {string} feature.buttonText - The text for the button.
 * @param {string} feature.featureTheme - The theme of the feature (season name)
 * @param {object} feature.image - The image object of the feature.
 * @param {object} feature.linkItems - The link items object.
 * @param {boolean} feature.pullImageFromLink - Flag indicating whether to pull the image from the link.
 * @param {string} feature.bodyText - The body text of the feature.
 * @param {string} feature.titleText - The title text of the feature.
 * @param {string} feature.linkItems.linkId - The ID of the link item.
 * @param {string} feature.linkItems.linkMetaDescription - The meta description of the link item.
 * @param {object} feature.linkItems.linkMainImage - The main image object of the link item.
 * @param {string} feature.linkItems.linkSlug - The slug of the link item.
 * @param {string} feature.linkItems.linkType - The type of the link item.
 * @param {string} feature.linkItems.linkMainImage.asset._ref - The reference of the main image asset.
 * @param {string} feature.linkItems.linkMainImage._type - The type of the main image.
 * @param {string} feature.linkItems.linkMainImage.alt - The alt text of the main image.
 * @returns {object} An object containing the destructured properties.
 * @returns {string} return.bodyPortText - The body text or meta description.
 * @returns {string} return.buttonText - The text for the button.
 * @returns {object} return.seasonThemeObj - The season object for the feature theme.
 * @returns {object} return.featureImage - The feature image.
 * @returns {string} return.linkSlug - The slug of the link item.
 * @returns {string} return.linkType - The type of the link item.
 * @returns {string} return.linkId - The ID of the link item.
 * @returns {string} return.titleText - The title text of the feature.
 */
export const destructureFeature = (feature) => {
  const {
    _type,
    pullTextFromLink,
    buttonText,
    featureTheme,
    image,
    linkItems,
    pullImageFromLink,
    bodyText,
    titleText,
  } = feature || {}

  const { linkId, linkMetaDescription, linkMainImage, linkSlug, linkType } = linkItems || {}

  const {
    asset: { _ref: mainImageRef } = {},
    _type: mainImageType,
    alt: mainImageAlt,
  } = linkMainImage || {}

  const featureImage = pullImageFromLink ? (linkMainImage ?? image ?? null) : (image ?? null)

  const bodyPortText = pullTextFromLink
    ? (linkMetaDescription ?? bodyText ?? null)
    : (bodyText ?? null)

  console.log('feature:', feature)

  const seasonThemeObj = getSeasonObject(featureTheme)
  console.log('seasonThemeObj:', seasonThemeObj)

  return {
    bodyPortText,
    buttonText,
    seasonThemeObj,
    featureImage,
    featureTheme,
    linkSlug,
    linkType,
    linkId,
    titleText,
  }
}
