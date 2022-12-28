export const CURRENT_MONTH_NUMBER = new Date(Date.now()).getMonth() + 1;

// retrieves langing page data
export const LANDING_PAGE_QUERY = `
*[_type == "landingPage" && wasDeleted != true && isDraft != true]
{
  id,
  titleText,
  subtitleText,
  slug,
  buttonOne {
    buttonLabel,
   "slug": buttonLink.internal->slug.current
  }, 
  buttonTwo {
    buttonLabel,
    "slug": buttonLink.internal->slug.current
  }, 
  mainImage {
    ...,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  },
  mobileImage {
    ...,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  }, 
}`;


// retrieves native plants blooming in the current month
export const BLOOMING_NOW_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant" && ${CURRENT_MONTH_NUMBER} in floweringMonths]
  {
    plantName, previewImage {...}, slug, description
  }`;

// retrieves the season document that matches the current month
export const CURRENT_SEASON_QUERY = `*[!(_id in path('drafts.**')) && _type == "season" && ${CURRENT_MONTH_NUMBER} in monthNumbers]
    {
      ...
    }`;

// retrieves plants blooming in the current month
export const ALL_SEASONS_QUERY = `*[!(_id in path('drafts.**')) && _type == "season"]
    {
      ...
    }`;
