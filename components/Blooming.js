import React from 'react'
import ResponsiveImage from './ResponsiveImage'
import { getCurrentMonthName, titleCase } from '../utilities/helperUtil'
import Header from './Header'
import PortTextWrapper from './PortTextWrapper'

import cx from 'classnames'
import Link from 'next/link'
import ImageSlider from './ImageSlider'

const Blooming = (props) => {
  const { bloomingList, seasonData, className = '' } = props
  const thisMonth = getCurrentMonthName()
  const sliderImages = bloomingList.map((plant) => {
    plant.image.caption = plant.plantName?.commonName
    return plant.image
  })
  console.log('slider images', sliderImages)

  return (
    <>
      {bloomingList && (
        <section
          id={`bloomingNow`}
          className={cx(`bp-800:flex justify-center w-full`, className)}
        >
          <div className="blooming-grid px-4 py-4 w-full bp-800:mr-10">
            <Header
              id={`bloomingHeader`}
              className={`blooming-heading w-full p-0 text-xl`}
              headerClassName={`text-xl font-bold`}
            >
              <span className="text-3xl">BLOOMING</span> in
              {` ${titleCase(thisMonth)}`}
            </Header>
            {sliderImages.length > 0 && (
                <ImageSlider
                  className={`blooming-slider`}
                  sliderImages={sliderImages}
                  lightboxIdentifier={`bloomingNow`}
                  showArrows={true}
                  useLinks
                />
            )}
            {seasonData?.description && (
              <PortTextWrapper
                className={`blooming-description`}
                value={seasonData.description}
                components={{}}
              />
            )}
          </div>
        </section>
      )}
    </>
  )
}

export default Blooming
