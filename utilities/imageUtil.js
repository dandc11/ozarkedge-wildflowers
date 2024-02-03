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
 * Returns the foreground hex color from the image palette.
 *
 * @param {Object} image - The image object.
 * @param {string} paletteType - The type of palette.
 * @returns {string} - The foreground hex color.
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
 * Returns the title hex color from the image palette.
 *
 * @param {Object} image - The image object.
 * @param {string} paletteType - The type of palette.
 * @returns {string} - The title hex color.
 */
export const getImagePaletteTitleColor = (image, paletteType) => {
  let palette = getImagePalette(image, paletteType)
  return palette.title
}

// CSS background image helper functions
/*--------------------------------------*/

/**
 * Builds a background style object based on the provided parameters. For use with the <Container /> component, which uses container queries to set the background image to appropriate image size variables.
 *
 * @param {Object} bgParamObj - The background parameters object.
 * @param {string} bgParamObj.bgImage - Sanity image asset object - {_type: 'image', asset: {_ref: 'image-asset-id'}}
 * @param {string} bgParamObj.bgImageSmall - Sanity image asset object for a small-sized background image.
 * @param {string} bgParamObj.bgColor - The background color.
 * @param {string} bgParamObj.bgBlendMode - The background blend mode.
 * @param {number} bgParamObj.bgOpacity - The background opacity.
 * @param {string} bgParamObj.bgPosition - The background position.
 * @returns {Object} - The style object representing the background style.
 */
export const buildBackgroundStyleObject = (bgParamObj) => {
  const { bgImage, bgImageSmall, bgColor, bgBlendMode, bgPosition, bgOpacity} = bgParamObj
  let styleObject = {}

  if (bgImage) {
    let bgImageUrl = `url('${urlForImage(bgImage)}')`
    let bgImageSmallUrl = bgImageSmall
      ? `url('${urlForImage(bgImageSmall)}')`
      : bgImageUrl

    styleObject['--container-bg-image'] = `${bgImageUrl}`
    styleObject['--container-bg-small'] = `${bgImageSmallUrl}`

    // TODO - use container queries to set the background image to appropriate image size variables
  }

  if (bgColor) {
    let color = bgColor !== 'palette'
      ? bgColor
      : getImagePaletteBackgroundColor(bgImage, 'darkVibrant')
    styleObject['--container-bg-color'] = color

    if (bgOpacity) {
      styleObject['--container-bg-color'] = `${bgColor + bgOpacity}`
    }
  }
  if (bgBlendMode) {
    styleObject['--container-bg-blend-mode'] = bgBlendMode
  }
  if (bgPosition) {
    styleObject['--container-bg-position'] = bgPosition
  }
  return styleObject
}

/**
 * Retrieves an array of unique image objects from the provided document data. This function is useful ensuring duplicate images in a document aren't passed to image presnetation components, such as the <ImageGallery /> or <Lightbox /> components.
 *
 * @param {Object} docData - The document data object.
 * @param {Array} excludedKeys - An optional array of keys to exclude from the result.
 * @returns {Array} - An array of unique image objects.
 */
export const getUniqueImagesFromDocument = (docData, excludedKeys = []) => {
  const figures = []

  const imageIsUnique = (image) => {
    return (
      !figures.some((f) => f.asset._ref === image.asset._ref) &&
      !figures.some((f) => f.caption === image.caption) &&
      image.asset
    )
  }

  for (const key in docData) {
    const value = docData[key]

    if (!excludedKeys.includes(key) && Array.isArray(value)) {
      value.forEach((dataObj) => {
        if (dataObj._type === 'figure') {
          imageIsUnique(dataObj) ? figures.push(dataObj) : false
        }
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
