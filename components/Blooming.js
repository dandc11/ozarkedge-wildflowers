import React from 'react'
import { getCurrentMonthName, titleCase } from '../utilities/helperUtil'
import Heading from './Heading'
import PortTextWrapper from './PortTextWrapper'
import cx from 'classnames'
import ImageSlider from './ImageSlider'

const Blooming = (props) => {
  const { bloomingList, seasonData, className = '' } = props
  const thisMonth = getCurrentMonthName()
  const sliderPlants = bloomingList
    .filter((plant) => plant.image)
    .map((plant) => {
      plant.image.caption = plant.plantName?.commonName
      plant.image.docType = 'nativePlant'
      plant.image.slug = plant.slug
      return plant.image
    })

  return (
    <>
      {bloomingList && (
        <section
          id={`bloomingNow`}
          className={cx(
            `blooming-now bp-800:flex justify-center w-full`,
            className,
          )}
        >
          <div className="blooming-grid px-4 py-4 w-full">
            <Heading
              id={`bloomingHeader`}
              className={`blooming-heading w-full p-0 text-xl`}
              headingClassName={`text-xl font-bold`}
            >
              <span className="text-3xl">BLOOMING</span> in
              {` ${titleCase(thisMonth)}`}
            </Heading>
            {sliderPlants.length > 0 && (
              <ImageSlider
                className={`blooming-slider overflow-hidden`}
                sliderImages={sliderPlants}
                lightboxIdentifier={`bloomingNow`}
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
