import React from 'react'
import cx from 'classnames'

import HeadingDisplay from '../../components/HeadingDisplay'
import { client } from '../lib/sanity.client'
import ResponsiveImage from '../../components/ResponsiveImage'
import ContextUpdater from '../../components/ContextUpdater'
import PlantListGridWithSuspense from '../../components/PlantListGrid'
import {
  GET_NATIVE_PLANT_LIST_DATA_QUERY,
  GET_PLANT_LIST_PAGE_DATA_QUERY,
} from '../lib/queries'

const NativePlantPage = async () => {
  /**
   * TODO: 1. PREVIEW - useLiveQuery is a client-side hook, so this will not work in production - need to use Sanity's app router preview kit guide
   */

  const nativePlantPageData = await client.fetch(GET_PLANT_LIST_PAGE_DATA_QUERY)
  const nativePlantList = await client.fetch(GET_NATIVE_PLANT_LIST_DATA_QUERY)

  const {
    pageTitle,
    navButtonColor = 'light',
    mainImage,
    mobileImage,
    plantListInformation,
  } = nativePlantPageData[0]

  return (
    <div className="plant-list-page-content">
      <div className="plant-list-header relative ">
        <ContextUpdater navButtonColor={navButtonColor} />
        <HeadingDisplay absolute headingClassName={'text-display'}>
          <span
            className={cx('no-wrap', {
              'text-light': navButtonColor === 'light',
              'text-dark': navButtonColor !== 'light',
            })}
          >
            Native Wildflowers
          </span>{' '}
          <span
            className={cx('no-wrap', {
              'text-light': navButtonColor === 'light',
              'text-dark': navButtonColor !== 'light',
            })}
          >
            at Ozarkedge
          </span>
        </HeadingDisplay>
        <ResponsiveImage
          image={mainImage}
          alt={pageTitle}
          disableHover
          disablePointer
          loading="eager"
          figureClassName="h-full w-full"
          wrapperClassName="banner-img"
          className="w-full h-full "
        />
        <ResponsiveImage
          image={mobileImage ? mobileImage : mainImage}
          alt={pageTitle}
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
        plantListInformation={plantListInformation}
      />
    </div>
  )
}

export default NativePlantPage
