import { createImageUrlBuilder } from '@sanity/image-url'

import { dataset, projectId } from './sanity.api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

/**
 * Returns a Sanity image url with the parameters applied
 * @param { Object } source
 * @param {Object} options
 * @param {number} [options.width] - The width of the image
 * @param {number} [options.height] - The height of the image
 * @param {number} [options.quality=80] - The quality of the image
 * @param {string} [options.format='auto'] - The format of the image
 * @returns {string} - The URL of the image
 */
export const urlForImage = (source, options) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  // If options are provided, apply them to the image URL
  if (options) {
    const { width, height, quality = 80 } = options
    let builder = imageBuilder.image(source).width(width).quality(quality).auto('format')
    // Only set height when explicitly provided — omitting it lets the Sanity
    // builder apply the user's crop without forcing an aspect ratio
    if (height) {
      builder = builder.height(height)
    }
    return builder
  }

  return imageBuilder?.image(source).auto('format')
}
