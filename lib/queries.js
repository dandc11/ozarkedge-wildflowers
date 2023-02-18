export const CURRENT_MONTH_NUMBER = new Date(Date.now()).getMonth() + 1;

// retrieves langing page data
export const GET_LANDING_PAGE_DATA_QUERY = `
*[_type == "landingPage" && wasDeleted != true && isDraft != true]
{
  id,
  titleText,
  subtitleText,
  slug,
  buttonOne {
    buttonLabel,
   "slug": buttonLink.internalLink->slug.current,
    "docType": buttonLink.internalLink->_type
  }, 
  buttonTwo {
    buttonLabel,
    "slug": buttonLink.internalLink->slug.current,
    "docType": buttonLink.internalLink->_type
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

// retrieves native plant data for plants blooming in the current month
export const GET_BLOOMING_PLANTS_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant" && ${CURRENT_MONTH_NUMBER} in floweringMonths]
  {
    plantName, previewImage {...}, slug, metaDescription, description, "excerpt": array::join(string::split((pt::text(description)), "")[0..400], "") + "..."
  }`;

// retrieves the season document that matches the current month
export const GET_CURRENT_SEASON_QUERY = `*[!(_id in path('drafts.**')) && _type == "season" && ${CURRENT_MONTH_NUMBER} in monthNumbers]
    {
      ...,
      mainImage {
        ..., 
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      }
    }`;

// retrieves the paths of all published native plants
export const GET_ALL_SEASON_PATHS_QUERY = `*[!(_id in path('drafts.**')) && _type == "season" && defined(slug.current)][].slug.current`;

// retrieves all season documents
export const GET_ALL_SEASONS_QUERY = `*[!(_id in path('drafts.**')) && _type == "season"]
    {
      ...
    }`;

// retrieves the paths of all published native plants
export const GET_ALL_NATIVE_PLANT_PATHS_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant" && defined(slug.current)][].slug.current`;

// retrieves the document data of all published native plants
export const GET_ALL_NATIVE_PLANTS_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant"]{...}`;

// retrieves the document data of all published native plants
export const GET_MENU_ITEMS_QUERY = `*[!(_id in path('drafts.**')) && _type == "menu"]
{
  ...
}
`;
