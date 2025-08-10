import React from 'react'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'

import HeadingDisplay from '../../components/HeadingDisplay'
import ResponsiveImage from '../../components/ResponsiveImage'
import PlantListGridWrapper from '../../components/PlantListGridWrapper'
import {
  GET_NATIVE_PLANT_LIST_DATA_QUERY,
  GET_PLANT_LIST_PAGE_DATA_QUERY,
} from '../../sanity/lib/queries'
import { IMG_SIZES } from '../../utilities/constants'
import { sanityFetch } from '../../sanity/lib/sanity.live'

const NativePlantPage = async () => {
  const nativePlantPageQueryResponse = await sanityFetch({ query: GET_PLANT_LIST_PAGE_DATA_QUERY })
  const nativePlantPageData = nativePlantPageQueryResponse?.data?.[0] ?? null

  const nativePlantListQueryResponse = await sanityFetch({
    query: GET_NATIVE_PLANT_LIST_DATA_QUERY,
  })
  const nativePlantList = nativePlantListQueryResponse?.data ?? []

  const menuButtonColor = stegaClean(nativePlantPageData?.menuButtonColor) || 'light'

  return (
    <div className={`plant-list-page-content nav-${menuButtonColor}`}>
      <div className="plant-list-header relative ">
        <HeadingDisplay absolute headingClassName={'text-display'}>
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
