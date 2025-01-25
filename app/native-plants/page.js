import React from 'react'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'

import HeadingDisplay from '../../components/HeadingDisplay'
import ResponsiveImage from '../../components/ResponsiveImage'
import PlantListGridWithSuspense from '../../components/PlantListGrid'
import {
  GET_NATIVE_PLANT_LIST_DATA_QUERY,
  GET_PLANT_LIST_PAGE_DATA_QUERY,
} from '../../sanity/lib/queries'
import { sanityFetch } from '../../sanity/lib/sanity.live'

const NativePlantPage = async () => {
  const nativePlantQueryResponse = await sanityFetch({ query: GET_PLANT_LIST_PAGE_DATA_QUERY })
  const nativePlantPageData = nativePlantQueryResponse?.data?.[0] ?? null
  const nativePlantListQueryResponse = await sanityFetch({
    query: GET_NATIVE_PLANT_LIST_DATA_QUERY,
  })
  const nativePlantList = nativePlantListQueryResponse?.data ?? []

  const menuButtonColor = stegaClean(nativePlantPageData?.menuButtonColor) || 'light'

  return (
    <div className="plant-list-page-content">
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
          image={nativePlantPageData?.mainImage}
          alt={nativePlantPageData?.pageTitle}
          disableHover
          disablePointer
          loading="eager"
          figureClassName="h-full w-full"
          wrapperClassName="banner-img"
          className="w-full h-full "
        />
        <ResponsiveImage
          image={
            nativePlantPageData?.mobileImage
              ? nativePlantPageData?.mobileImage
              : nativePlantPageData?.mainImage
          }
          alt={nativePlantPageData?.pageTitle}
          disableHover
          disablePointer
          loading="eager"
          figureClassName="h-full w-full"
          wrapperClassName="banner-img mobile"
          className="w-full h-full"
        />
      </div>
      <PlantListGridWithSuspense
        nativePlantPageData={nativePlantPageData}
        nativePlantList={nativePlantList}
        plantListInformation={nativePlantPageData?.plantListInformation}
      />
    </div>
  )
}

export default NativePlantPage
