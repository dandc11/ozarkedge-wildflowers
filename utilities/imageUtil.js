import { urlForImage } from '../lib/sanity.image'
import { SanityImage } from 'sanity-image'
import { projectId, dataset } from '../lib/sanity.api'

/**
 * Returns a Sanity image url with the parameters applied
 * @param { Object } image
 * @param {Object} options
 * @returns
 */
/*--------------------------------------*/
export const getImageUrl = (image, options = {}) => {
  if (options.width) {
    const { width, height } = options
    urlForImage(image).width(width).height(height)
  }

  return urlForImage(image)
}

/**
 * Returns an object of palette values according to the palette type
 * @param {Object} image
 * @param {string } paletteType
 * @returns {Object}
 */
export const getImagePalette = (image, paletteType) => {
  let paletteColors = {
    background: '#f34b3c',
    foreground: '#fff',
    population: 1292,
    title: '#fff',
  }
  if (image.palette)
    switch (paletteType) {
      case 'darkMuted':
        paletteColors = image.palette.darkMuted
          ? image.palette.darkMuted
          : paletteColors
        break
      case 'darkVibrant':
        paletteColors = image.palette.darkVibrant
          ? image.palette.darkVibrant
          : paletteColors
        break
      case 'dominant':
        paletteColors = image.palette.dominant
          ? image.palette.dominant
          : paletteColors
        break
      case 'lightMuted':
        paletteColors = image.palette.lightMuted
          ? image.palette.lightMuted
          : paletteColors
        break
      case 'lightVibrant':
        paletteColors = image.palette.lightVibrant
          ? image.palette.lightVibrant
          : paletteColors
        break
      case 'vibrant':
        paletteColors = image.palette.vibrant
          ? image.palette.vibrant
          : paletteColors
        break
      case 'muted':
        paletteColors = image.palette.muted
          ? image.palette.muted
          : paletteColors
        break
      default:
        break
    }
  return paletteColors
}

/** Returns the image palette's background hex color
 * @param {Object} image
 * @param {string} paletteType
 * @returns {string} background
 */
export const getImagePaletteBackgroundColor = (image, paletteType) => {
  let palette = getImagePalette(image, paletteType)
  return palette.background
}

/**
 * Returns the image palette's foreground hex color
 * @param {Object} image
 * @param {string} paletteType
 * @returns {string} foreground
 */
export const getImagePaletteForegroundColor = (image, paletteType) => {
  let palette = getImagePalette(image, paletteType)
  return palette.foreground
}

/**
 * Returns the image palette's population
 * @param {Object} image
 * @param {string} paletteType
 * @returns {number} population
 */
export const getImagePalettePopulation = (image, paletteType) => {
  let palette = getImagePalette(image, paletteType)
  return palette.population
}

/**
 * Returns the image palette's title hex color
 * @param {Object} image
 * @param {string} paletteType
 * @returns {string} title text color
 */
export const getImagePaletteTitleColor = (image, paletteType) => {
  let palette = getImagePalette(image, paletteType)
  return palette.title
}

// CSS background image helper functions
/*--------------------------------------*/
export const buildBackgroundStyleObject = (bgParamObj) => {
  const {
    bgImage = undefined,
    bgImageMedium = undefined,
    bgImageSmall = undefined,
    bgColor = undefined,
    bgBlendMode = undefined,
    bgOpacity = undefined,
    // bgImageWidth = undefined,
    // bgImageHeigth
  } = bgParamObj
  let styleObject = {}

  // if there's a background image...
  if (bgImage) {
    let bgImageUrl = `url('${urlForImage(bgImage)}')`

    //...get url values for any responsive image sizes
    let bgImageMediumUrl = bgImageMedium
      ? `url('${urlForImage(bgImageMedium)}')`
      : bgImageUrl

    let bgImageSmallUrl = bgImageSmall
      ? `url('${urlForImage(bgImageSmall)}')`
      : bgImageUrl

    // ...set CSS variables
    styleObject['--bg-large'] = `${bgImageUrl}`
    styleObject['--bg-medium'] = `${bgImageMediumUrl}`
    styleObject['--bg-small'] = `${bgImageSmallUrl}`
  }

  // accept 'palette' to get colors from Sanity's image color palette
  if (bgColor) {
    styleObject.backgroundColor =
      bgColor !== 'palette'
        ? bgColor
        : getImagePaletteBackgroundColor(bgImage, 'darkVibrant')
    if (bgOpacity) {
      styleObject.backgroundColor = `${styleObject.backgroundColor + bgOpacity}`
    }
  }
  if (bgBlendMode) {
    styleObject.backgroundBlendMode = bgBlendMode
  }
  return styleObject
}

/**
 * Retrieves an array of unique image objects from the provided document data.
 *
 * @param {Object} docData - The document data object.
 * @param {Array} excludedKeys- An optional array of keys to exclude from the result.
 * @returns {Array} - An array of unique image objects.
 */
export const getUniqueImagesFromDocument = (docData, excludedKeys = []) => {
  const figures = []

  const imageIsUnique = (image) => {
    return (
      // Check for duplicates of image asset reference, caption in the figures array, and that the image has an asset
      !figures.some((f) => f.asset._ref === image.asset._ref) &&
      !figures.some((f) => f.caption === image.caption) &&
      image.asset
    )
  }

  // Iterate through each key in the document data
  for (const key in docData) {
    const value = docData[key]

    // Ignore any excluded keys and verify the value is an array
    if (!excludedKeys.includes(key) && Array.isArray(value)) {
      // Iterate through each data object in the value array
      value.forEach((dataObj) => {
        // Check if the data object type is 'figure'
        if (dataObj._type === 'figure') {
          imageIsUnique(dataObj) ? figures.push(dataObj) : false
        }
        // Check if the data object type is 'imageCollection'
        if (dataObj._type === 'imageCollection') {
          dataObj.imageCollection.forEach((image) => {
            imageIsUnique(image) ? figures.push(image) : false
          })
        }
      })
    }
  }

  return figures
}
