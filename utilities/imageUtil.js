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
  if (image?.palette)
    switch (paletteType) {
      case 'darkMuted':
        paletteColors = image.palette.darkMuted ? image.palette.darkMuted : paletteColors
        break
      case 'darkVibrant':
        paletteColors = image.palette.darkVibrant ? image.palette.darkVibrant : paletteColors
        break
      case 'dominant':
        paletteColors = image.palette.dominant ? image.palette.dominant : paletteColors
        break
      case 'lightMuted':
        paletteColors = image.palette.lightMuted ? image.palette.lightMuted : paletteColors
        break
      case 'lightVibrant':
        paletteColors = image.palette.lightVibrant ? image.palette.lightVibrant : paletteColors
        break
      case 'vibrant':
        paletteColors = image.palette.vibrant ? image.palette.vibrant : paletteColors
        break
      case 'muted':
        paletteColors = image.palette.muted ? image.palette.muted : paletteColors
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

/**
 * This function returns an array of unique images from a document data object.
 * An image is considered unique if its reference and caption are not repeated in the document.
 *
 * @param {Object} docData - The document data object.
 * @param {Array} excludedKeys - An optional array of keys to exclude from the result.
 * @returns {Array} - An array of unique image objects.
 */
export const getUniqueImagesFromDocument = (docData, excludedKeys = []) => {
  const uniqueImageRefs = new Set() // Set to store unique image references
  const uniqueImageCaptions = new Set() // Set to store unique image captions
  const excludedKeysSet = new Set(excludedKeys) // Convert excludedKeys array to a Set for faster lookup

  const addUniqueImage = (image) => {
    uniqueImageRefs.add(image.asset._ref) // Add image reference to the Set
    uniqueImageCaptions.add(image.caption) // Add image caption to the Set
    return image
  }

  const imageIsUnique = (image) => {
    return (
      image &&
      image.asset &&
      !uniqueImageRefs.has(image.asset._ref) && // Check if image reference is unique
      !uniqueImageCaptions.has(image.caption) // Check if image caption is unique
    )
  }

  const images = []
  for (const key in docData) {
    if (docData.hasOwnProperty(key) && !excludedKeysSet.has(key)) {
      const value = docData[key]
      if (Array.isArray(value)) {
        value.forEach((dataObj) => {
          if (dataObj._type === 'figure' && imageIsUnique(dataObj)) {
            images.push(addUniqueImage(dataObj))
          }
          if (dataObj._type === 'imageCollection' && Array.isArray(dataObj.imageCollection)) {
            dataObj.imageCollection.forEach((image) => {
              if (imageIsUnique(image)) {
                images.push(addUniqueImage(image))
              }
            })
          }
        })
      }
    }
  }

  return images
}
