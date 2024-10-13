import { CURRENT_MONTH_NUMBER } from '../../utilities/constants'

// retrieves langing page data
export const GET_LANDING_PAGE_DATA_QUERY = `
*[_type == "landingPage" && wasDeleted != true && isDraft != true]
{
  id,
  titleText,
  subtitleText,
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

export const GET_PLANT_LIST_PAGE_DATA_QUERY = `
*[_type == "plantListPage" && wasDeleted != true && isDraft != true]
{
  id,
  pageTitle,
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
    _type == "figure" => {
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
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
    _type == "imageCollection" => {
      ...,
    },
    _type == "portTextVideo" => {
      ...,
      "playbackId": video.asset->playbackId,
      "videoTitle": title,
      "videoData": video.asset->data,
      "useTitleAsCaption": useTitleAsCaption,
      "alt": alt,
      "caption": caption,
    },
    _type == "teaserSection" => {
      _type,
      "bodyText": bodyText,
      "titleText": titleText,
      buttonText,
      images,
      "linkItems": 
        link->{
          "itemId": _id,
          "itemType" : _type, 
          "itemSlug": slug.current,
          "itemMetaDescription": metaDescription,
          "itemMainImage": mainImage 
        },
    },
  },
  slug
}`

// retrieves native plant data for the first 7 plants blooming in the current month
export const GET_BLOOMING_PLANTS_DATA_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant" && ${CURRENT_MONTH_NUMBER} in floweringMonths][0...7]
  {
    "docType": _type, plantName, "image": previewImage {...}, bannerImage, "slug": slug.current, metaDescription, description, "excerpt": array::join(string::split((pt::text(description)), "")[0..400], "") + "..."
  }`

// get the previewImage of the first 7 native plants with a floweringMonth matching the current month
export const GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant" && ${CURRENT_MONTH_NUMBER} in floweringMonths][0...7]
  {
    "image": previewImage {...}
  }`

// retrieves the season document that matches the current month
export const GET_CURRENT_SEASON_DATA_QUERY = `*[!(_id in path('drafts.**')) && _type == "season" && ${CURRENT_MONTH_NUMBER} in monthNumbers]
    {
      ...,
      mainImage {
        ..., 
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      }
    }`

// retrieves the paths of all published season documents
export const GET_ALL_SEASON_PATHS_QUERY = `*[!(_id in path('drafts.**')) && _type == "season" && defined(slug.current)][].slug.current`

// retrieves all season documents
export const GET_ALL_SEASONS_DATA_QUERY = `*[!(_id in path('drafts.**')) && _type == "season"]
    {
      ...
    }`

// retrieves the season document based on the slug
export const GET_SEASON_PAGE_DATA_QUERY = `*[!(_id in path('drafts.**')) && _type == "season" && slug.current == $slug][0]
  {
    ...,
    description[]{
    ...,
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
    }
  }`

// retrieves the paths of all published native plants
export const GET_ALL_NATIVE_PLANT_PATHS_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant" && defined(slug.current)][].slug.current`

// retrieves the document data of all published native plants
export const GET_NATIVE_PLANT_LIST_DATA_QUERY = `*[!(_id in path('drafts.**')) && _type == "nativePlant"]{  
  floweringMonths[],
  flowerColor[],
  habitatType, 
  plantName,
  previewImage,
  slug
}`

// retrieves the document data of all published native plants
export const GET_MENU_ITEMS_QUERY = `*[!(_id in path('drafts.**')) && _type == "menu"]
{
  ...
}
`
// gets all document data for the about page
export const GET_ABOUT_PAGE_DATA_QUERY = `*[!(_id in path('drafts.**')) && _type == "aboutPage"]
{
  ...
}
`
// gets all document data for a nativePlant document based on the slug
export const GET_PLANT_PAGE_DATA = `
*[_type == "nativePlant" && slug.current == $slug][0] {
    bannerImage,
    mobileImage,
    menuButtonColor,
    metaDescription,
    lede[]{
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
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
      _type == "imageCollection" => {
        ...,
      },
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
    },
    images[]{
      ...,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    bloomText[]{
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
      _type == "imageCollection" => {
        ...,
      },
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
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
    },
    pollinators[]{
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
      _type == "imageCollection" => {
        ...,
      },
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
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
    },
    conservationRanking,
    conservationStatus[]{
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
      _type == "imageCollection" => {
        ...,
      },
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
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
    },
    description[]{
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
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
      _type == "imageCollection" => {
        ...,
      },
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
    },
    growingNearbyPlantList[]{
      ...,
      "slug": link.internalLink->slug.current,
      "docType": link.internalLink->_type,
      "palette": asset->metadata.palette,
      "lqip": asset->metadata.lqip,
    },
    growingNearbyText[]{
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
      _type == "imageCollection" => {
        ...,
      },
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
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
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
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
      _type == "imageCollection" => {
        ...,
      },
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
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
    },
    habitatType,
    habitat[]{
      _type == "teaserSection" => {
        _type,
        "bodyText": bodyText,
        "titleText": titleText,
        buttonText,
        images,
        "linkItems": 
          link->{
            "itemId": _id,
            "itemType" : _type, 
            "itemSlug": slug.current,
            "itemMetaDescription": metaDescription,
            "itemMainImage": mainImage 
          },
      },
      _type == "figure" => {
        ...,
        "palette": asset->metadata.palette,
        "lqip": asset->metadata.lqip,
      },
      _type == "imageCollection" => {
        ...,
      },
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
      _type == "portTextVideo" => {
        ...,
        "playbackId": video.asset->playbackId,
        "videoTitle": title,
        "videoData": video.asset->data,
        "useTitleAsCaption": useTitleAsCaption,
        "alt": alt,
        "caption": caption,
      },
    }
  }
`
