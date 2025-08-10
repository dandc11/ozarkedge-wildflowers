/**
 * Helper functions to generate GROQ query fragments
 * These can be used in queries.js to improve maintainability and consistency
 */

/**
 * Returns a GROQ query fragment for an image object with all metadata
 * @param {string} fieldName - The name of the image field
 * @param {boolean} [includeKey=false] - Whether to include _key in the query
 * @returns {string} GROQ query fragment for the image field
 */
export const imageFields = (fieldName, includeKey = false) => `
  ${fieldName} {
    _type,
    ${includeKey ? '_key,' : ''}
    alt,
    caption,
    asset {
      _ref,
      _type
    },
    crop {
      _type,
      bottom,
      left,
      right,
      top
    },
    hotspot {
      _type,
      height,
      width,
      x,
      y
    },
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  }`

/**
 * Returns a GROQ query fragment for figure content type
 * @param {boolean} [includeKey=true] - Whether to include _key in the query
 * @returns {string} GROQ query fragment for figure type
 */
export const figureFields = (includeKey = true) => `{
  _type,
  ${includeKey ? '_key,' : ''}
  alt,
  caption,
  captionPosition,
  showCaption,
  link,
  imagePosition,
  imageWidth,
  asset,
  crop,
  hotspot,
  "palette": asset->metadata.palette,
  "lqip": asset->metadata.lqip,
}`

/**
 * Returns a GROQ query fragment for block content type
 * @param {boolean} [includeKey=true] - Whether to include _key in the query
 * @returns {string} GROQ query fragment for block type
 */
export const blockFields = (includeKey = true) => `{
  _type,
  ${includeKey ? '_key,' : ''}
  style,
  listItem,
  level,
  children[]{
    _type,
    _key,
    text,
    marks[]
  },
  markDefs[]{
    _type,
    _key,
    _type == "internalLink" => {
        reference,
        "slug": @.reference->slug,
        "docType": @.reference->_type
    },
    _type == "externalLink" => {
        href,
        blank
    }
  },
}`

/**
 * Returns a GROQ query fragment for imageCollection content type
 * @param {boolean} [includeKey=true] - Whether to include _key in the query
 * @returns {string} GROQ query fragment for imageCollection type
 */
export const imageCollectionFields = (includeKey = true) => `{
  _type,
  ${includeKey ? '_key,' : ''}
  imageCollection[]{
    _type,
    _key,
    alt,
    caption,
    captionPosition,
    showCaption,
    link,
    imagePosition,
    imageWidth,
    asset,
    crop,
    hotspot,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  }
}`

/**
 * Returns a GROQ query fragment for portTextVideo content type
 * @param {boolean} [includeKey=true] - Whether to include _key in the query
 * @returns {string} GROQ query fragment for portTextVideo type
 */
export const videoFields = (includeKey = true) => `{
  _type,
  ${includeKey ? '_key,' : ''}
  title,
  video,
  useTitleAsCaption,
  alt,
  caption,
  "playbackId": video.asset->playbackId,
  "videoTitle": title,
  "videoData": video.asset->data,
}`

/**
 * Returns a GROQ query fragment for portable text array with all supported block types
 * @param {string} fieldName - The name of the portable text field
 * @returns {string} GROQ query fragment for portable text
 */
export const portableTextFields = (fieldName) => `
  ${fieldName}[]{
    _type == "teaserSection" => ${teaserSectionFields()},
    _type == "figure" => ${figureFields()},
    _type == "block" => ${blockFields()},
    _type == "imageCollection" => ${imageCollectionFields()},
    _type == "portTextVideo" => ${videoFields()},
  }`

/**
 * Returns a GROQ query fragment for textOnlyPortText array (only blocks, no media)
 * @param {string} fieldName - The name of the text-only portable text field
 * @returns {string} GROQ query fragment for text-only portable text
 */
export const textOnlyPortableTextFields = (fieldName) => `
  ${fieldName}[]{
    _type == "block" => ${blockFields()},
  }`

/**
 * Returns a GROQ query fragment for a button object with internal link dereferencing
 * @param {string} fieldName - The name of the button field
 * @returns {string} GROQ query fragment for the button field
 */
export const buttonFields = (fieldName) => `
  ${fieldName} {
    _type,
    buttonLabel,
    buttonLink {
      _type,
      internalLink {
        _ref,
        _type
      }
    },
    "slug": buttonLink.internalLink->slug.current,
    "docType": buttonLink.internalLink->_type
  }`

/**
 * Returns a GROQ query fragment for a main image object without metadata
 * @param {string} fieldName - The name of the image field
 * @returns {string} GROQ query fragment for the main image field
 */
export const mainImageFields = (fieldName) => `
  ${fieldName} {
    _type,
    alt,
    caption,
    asset {
      _ref,
      _type
    },
    crop {
      _type,
      bottom,
      left,
      right,
      top
    },
    hotspot {
      _type,
      height,
      width,
      x,
      y
    }
  }`

/**
 * Returns a GROQ query fragment for teaserSection content type
 * @param {boolean} [includeKey=true] - Whether to include _key in the query
 * @returns {string} GROQ query fragment for teaserSection type
 */
export const teaserSectionFields = (includeKey = true) => `{
  _type,
  ${includeKey ? '_key,' : ''}
  "bodyText": bodyText,
  "titleText": titleText,
  buttonText,
  image {
    ...,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  },
  "linkItems": 
    link->{
      "linkId": _id,
      "linkType": _type, 
      "linkSlug": slug.current,
      "linkMetaDescription": metaDescription,
      "linkMainImage": mainImage {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      }
    },
}`
