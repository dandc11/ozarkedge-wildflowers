import React from 'react'
import { draftMode } from 'next/headers'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'
import dynamic from 'next/dynamic'

import HeadingDisplay from '../../components/HeadingDisplay'
import ResponsiveImage from '../../components/ResponsiveImage'
const PlantListGridWrapper = dynamic(() => import('../../components/PlantListGridWrapper'))
import {
  GET_NATIVE_PLANT_LIST_DATA_QUERY,
  GET_PLANT_LIST_PAGE_DATA_QUERY,
} from '../../sanity/lib/queries'
import { IMG_SIZES } from '../../utilities/constants'
import { sanityFetch } from '../../sanity/lib/sanity.live'
import { urlForImage } from '../../sanity/lib/sanity.image'
import { editAttribute } from '../../sanity/lib/editAttribute'

/**
 * Generates metadata for the native plants list page.
 */
export async function generateMetadata() {
  const { data } = await sanityFetch({
    query: GET_PLANT_LIST_PAGE_DATA_QUERY,
    stega: false,
  })
  const pageData = data?.[0] ?? null
  const title = stegaClean(pageData?.pageTitle) || 'Native Wildflowers at Ozarkedge'
  const description = stegaClean(pageData?.metaDescription) || undefined
  const ogImage = pageData?.mainImage
    ? urlForImage(pageData.mainImage, { width: 1200, height: 630 })?.url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const NativePlantPage = async () => {
  const { isEnabled: isDraftMode } = await draftMode()
  const nativePlantPageQueryResponse = await sanityFetch({
    query: GET_PLANT_LIST_PAGE_DATA_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
    stega: isDraftMode,
  })
  const nativePlantPageData = nativePlantPageQueryResponse?.data?.[0] ?? null

  const nativePlantListQueryResponse = await sanityFetch({
    query: GET_NATIVE_PLANT_LIST_DATA_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
    stega: isDraftMode,
  })
  const nativePlantList = nativePlantListQueryResponse?.data ?? []

  const menuButtonColor = stegaClean(nativePlantPageData?.menuButtonColor) || 'light'

  return (
    <div className={`plant-list-page-content nav-${menuButtonColor}`}>
      <div className="plant-list-header relative ">
        <HeadingDisplay absolute headingLevel={1} headingClassName={'text-display'}>
          <span
            className={cx('no-wrap', {
              'text-light': menuButtonColor === 'light',
              'text-dark': menuButtonColor === 'dark',
            })}
          >
            Native Wildflowers
          </span>{' '}
          <span className={cx(`no-wrap text-${menuButtonColor}`)}>at Ozarkedge</span>
        </HeadingDisplay>
        <ResponsiveImage
          alt={nativePlantPageData?.pageTitle}
          className="w-full h-full "
          disableHover
          disablePointer
          fetchPriority="high"
          figureClassName="h-full w-full"
          image={nativePlantPageData?.mainImage}
          priority
          quality={95}
          sizes={IMG_SIZES.HERO_DESKTOP_SIZES}
          wrapperClassName="banner-img"
          data-sanity-edit-target="true"
          data-sanity={editAttribute(nativePlantPageData?._id, 'plantListPage', 'mainImage')}
        />
        <ResponsiveImage
          alt={nativePlantPageData?.pageTitle}
          className="w-full h-full"
          disableHover
          disablePointer
          fetchPriority="high"
          figureClassName="h-full w-full"
          image={
            nativePlantPageData?.mobileImage
              ? nativePlantPageData?.mobileImage
              : nativePlantPageData?.mainImage
          }
          priority
          quality={95}
          sizes={IMG_SIZES.HERO_MOBILE_SIZES}
          wrapperClassName="banner-img mobile"
          data-sanity-edit-target="true"
          data-sanity={editAttribute(nativePlantPageData?._id, 'plantListPage', 'mobileImage')}
        />
      </div>
      <PlantListGridWrapper
        nativePlantPageData={nativePlantPageData}
        nativePlantList={nativePlantList}
        plantListInformation={nativePlantPageData?.plantListInformation}
      />
    </div>
  )
}

export default NativePlantPage
