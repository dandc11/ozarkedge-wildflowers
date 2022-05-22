export const landingPageQuery = `
*[_type == "landingPage"] {
  id,
  titleText,
  subtitleText,
  mainImage {
    ...,
    "palette": asset->metadata.palette
  },
}`
