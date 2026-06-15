import { groq } from 'next-sanity'

import { CURRENT_MONTH_NUMBER } from '../../utilities/constants'

import {
  imageCollectionFields,
  imageFields,
  videoFields,
  figureFields,
  blockFields,
  teaserSectionFields,
  textOnlyPortableTextFields,
} from './queryFragments'

// retrieves welcome section data from the about page (used on both landing page and about page)
export const GET_WELCOME_SECTION_QUERY = groq`
*[_type == "aboutPage"][0] {
  ${figureFields('introPhoto')},
  ${figureFields('ecoRegionMap')},
  ${textOnlyPortableTextFields('introBody')},
  ${textOnlyPortableTextFields('locationBody')},
}`

// retrieves langing page data
export const GET_LANDING_PAGE_DATA_QUERY = groq`
*[_type == "landingPage"]
{
  _id,
  titleText,
  subtitleText,
  metaDescription,
  slug,
  menuButtonColor,
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
}`

export const GET_PLANT_LIST_PAGE_DATA_QUERY = groq`
*[_type == "plantListPage"]
{
  id,
  pageTitle,
  metaDescription,
  menuButtonColor,
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
  plantListInformation[]{
    _type == "figure" => ${figureFields()},
    _type == "block" => ${blockFields()},
    _type == "imageCollection" => ${imageCollectionFields()},
    _type == "portTextVideo" => ${videoFields()},
    _type == "teaserSection" => ${teaserSectionFields()},
  },
  slug
}`

// retrieves native plant data for the first 7 plants blooming in the current month
export const GET_BLOOMING_PLANTS_DATA_QUERY = groq`*[ _type == "nativePlant" && ${CURRENT_MONTH_NUMBER} in floweringMonths][0...7]
  {
    "docType": _type, 
    plantName, 
    "image": previewImage {
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    }, 
    bannerImage, 
    "slug": slug.current, 
    metaDescription, 
    description, 
    "excerpt": array::join(string::split((pt::text(description)), "")[0..400], "") + "..."
  }`

// get the previewImage of the first 7 native plants with a floweringMonth matching the current month
export const GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY = groq`*[ _type == "nativePlant" && ${CURRENT_MONTH_NUMBER} in floweringMonths][0...7]
  {
    "image": previewImage {
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    "caption": plantName.botanicalName[0],
    "slug": slug.current,
  }`

// retrieves the season document that matches the current month
export const GET_CURRENT_SEASON_DATA_QUERY = groq`*[ _type == "season" && ${CURRENT_MONTH_NUMBER} in monthNumbers]
  {
    ...,
    mainImage {
      ..., 
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    }
  }`

// retrieves the paths of all published season documents
export const GET_ALL_SEASON_PATHS_QUERY = `*[ _type == "season" && defined(slug.current)][].slug.current`

// retrieves all season documents
export const GET_ALL_SEASONS_DATA_QUERY = groq`*[ _type == "season"]
  {
    ...
  }`

// retrieves the season document based on the slug
export const GET_SEASON_PAGE_DATA_QUERY = groq`*[ _type == "season" && slug.current == $slug][0]
  {
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
    metaDescription,
    menuButtonColor,
    monthNumbers,
    seasonName,
    slug,
    _id,
    _type,
    description[]{
      ...,
    _type == "figure" => ${figureFields()},
    _type == "imageCollection" => ${imageCollectionFields()},
    _type == "teaserSection" => ${teaserSectionFields()},
    },
    feature {
      ...,
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
          }, 
        },
    }
  }`

// retrieves the paths of all published native plants
export const GET_ALL_NATIVE_PLANT_PATHS_QUERY = groq`*[ _type == "nativePlant" && defined(slug.current)][].slug.current`

// retrieves the slugs and plant names of all native plant documents
export const GET_NATIVE_PLANT_NAMES_AND_SLUGS_QUERY = groq`*[ _type == "nativePlant"]{
  plantName,
  slug 
}`

// retrieves the document data of all published native plants
export const GET_NATIVE_PLANT_LIST_DATA_QUERY = groq`*[ _type == "nativePlant"]{  
  floweringMonths[],
  flowerColor[],
  habitatType, 
  plantName,
  previewImage {
    ...,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  },
  slug
}`

// retrieves the document data of all published native plants
export const GET_MENU_ITEMS_QUERY = groq`
*[_type == "menu"]{
  menuBackgroundImage {
    ...,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  }, 
  mobileMenuBackgroundImage {
    ...,
    "palette": asset->metadata.palette,
    "lqip": asset->metadata.lqip,
  }, 
  menuItems[]{
    title,
    "menuItemLink": {
      "docType": link.internalLink->_type, 
      "slug": link.internalLink->slug.current
    }
  }
}
`
// gets all document data for the about page
export const GET_ABOUT_PAGE_DATA_QUERY = groq`*[ _type == "aboutPage"]
  {
    _id,
    _type,
    id,
    title,
    menuButtonColor,
    "metaDescription": aboutTeaserText,
    bannerStandfirst,
    slug,
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
    ${imageFields('introPhoto')},
    ${imageFields('ecoRegionMap')},
    ${textOnlyPortableTextFields('introBody')},
    ${textOnlyPortableTextFields('locationBody')},
    body[]{
      _type == "figure" => ${figureFields()},
      _type == "block" => ${blockFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "portTextVideo" => ${videoFields()},
      _type == "teaserSection" => ${teaserSectionFields()},
    }
  }
`
// gets all document data for a nativePlant document based on the slug
export const GET_PLANT_PAGE_DATA = groq`
*[_type == "nativePlant" && slug.current == $slug][0] {
    _id,
    bannerImage {
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    mobileImage {
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    menuButtonColor,
    metaDescription,
    floweringSeason,
    previewImage {
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    lede[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "block" => ${blockFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "portTextVideo" => ${videoFields()},
    },
    images[]{
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    bloomText[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "block" => ${blockFields()},
      _type == "portTextVideo" => ${videoFields()},
    },
    pollinators[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "block" => ${blockFields()},
      _type == "portTextVideo" => ${videoFields()},
    },
    conservationRanking,
    conservationStatus[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "block" => ${blockFields()},
      _type == "portTextVideo" => ${videoFields()},
    },
    description[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "block" => ${blockFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "portTextVideo" => ${videoFields()},
    },
    growingNearbyPlantList[]{
      // Project data in the exact shape ImageSlider expects:
      // - Image properties at top level
      // - slug/docType from auto-resolved linkedPlant (single query, spread to keep flat structure)
      _type == "nearbyPlantFigure" => {
        ...image,
        "palette": image.asset->metadata.palette,
        "lqip": image.asset->metadata.lqip,
        ...(*[_type == "nativePlant" && !(_id in path("drafts.**")) && 
          lower(plantName.botanicalName[0]) match lower(^.plantBotanicalName)][0]{
          "slug": slug.current,
          "docType": _type
        })
      }
    },
    growingNearbyText[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "block" => ${blockFields()},
      _type == "portTextVideo" => ${videoFields()},
    },
    plantName{
        ...,
        nameInformation[]{
            ...,
            markDefs[]{
                ...,
                _type == "internalLink" => {
                    "slug": @.reference->slug,
                    "docType": @.reference->_type
                }
            }
        }
    },
    tidbits[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "block" => ${blockFields()},
      _type == "portTextVideo" => ${videoFields()},
    },
    habitatType,
    habitat[]{
      _type == "teaserSection" => ${teaserSectionFields()},
      _type == "figure" => ${figureFields()},
      _type == "imageCollection" => ${imageCollectionFields()},
      _type == "block" => ${blockFields()},
      _type == "portTextVideo" => ${videoFields()},
    }
  }
`

// retrieves site settings for metadata fallbacks
export const GET_SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  title,
  description,
  keywords
}`

// retrieves all plant slugs, names, images, and update times for the sitemap
export const GET_ALL_PLANTS_SITEMAP_DATA_QUERY = groq`*[_type == "nativePlant" && defined(slug.current)]{
  "slug": slug.current,
  "updatedAt": _updatedAt,
  "image": previewImage.asset->url
}`

// retrieves all season slugs and update times for the sitemap
export const GET_ALL_SEASONS_SITEMAP_DATA_QUERY = groq`*[_type == "season" && defined(slug.current)]{
  "slug": slug.current,
  "updatedAt": _updatedAt
}`

// gets all document data for the not found page
export const NOT_FOUND_PAGE_QUERY = groq`*[ _type == "notFoundPage" ] {
  ...,
  message[]{
    ...,
    _type == "teaserSection" => ${teaserSectionFields()},
    _type == "figure" => {
      ...
    },
  _type == "imageCollection" => ${imageCollectionFields()},
    _type == "block" => {
      ...,
        markDefs[]{
        ...,
        _type == "internalLink" => {
            "slug": @.reference->slug,
            "docType": @.reference->_type
        }
      },
    },
  }
}`
