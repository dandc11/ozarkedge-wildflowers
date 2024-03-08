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
  const sliderImages = bloomingList.map((plant) => plant.image);

  return (
    <>
      {bloomingList && (
        <section
          id={`bloomingNow`}
          className={cx(
            `bp-800:flex justify-center w-full`,
            className,
          )}
        >
          <div className="px-4 py-4 flex-1 bp-800:mr-10 bp-800:max-w-xl">
            <Header
              id={`bloomingHeader`}
              className={`w-full p-0 text-xl`}
              headerClassName={`text-xl font-bold`}
            >
              <span className="text-3xl">BLOOMING</span> in
              {` ${titleCase(thisMonth)}`}
            </Header>
            {sliderImages.length > 0 && (
              <ImageSlider
                className={`bp-800:hidden`}
                sliderImages={sliderImages}
                lightboxIdentifier={`bloomingNow`}
                useLinks
              />
            )}
            {seasonData?.description && (
              <div className={``}>
                <PortTextWrapper
                  className={``}
                  value={seasonData.description}
                  components={{}}
                />
              </div>
            )}
          </div>
          {bloomingList && bloomingList.length > 0 ? (
          <div
            id={`bloomingSliderContainer`}
            className={`hidden relative flex-1 min-h-[530px] overflow-auto w-full max-w-3xl hide-scroll bp-800:block bp-800:mt-7 bp-800:mr-5`}
          >
            <ul
              id={`bloomingList`}
              className={cx(
                'absolute left-0 w-full grid grid-flow-row-dense grid-cols-2 bp-1000:grid-cols-3 justify-items-start gap-3',
              )}
            >
              {bloomingList.map((plant, index) => (
                <li
                  className={cx()}
                  key={index + plant.plantName?.commonName?.trim()}
                >
                  <div>
                    <Link href={`/native-plants/${plant.slug}`}>
                      <ResponsiveImage
                        className={`featured-image w-full object-cover aspect-[8/6] h-auto max-w-[16rem] max-bp-800:min-w-[85vw] bp-800:aspect-[3/4] bp-800:h-auto`}
                        wrapperClassName={`blooming-plant-img relative transition ease-in-out delay-150`}
                        figureClassName={`rounded-none`}
                        captionBgClassName={`bg-transparent`}
                        blurDataURL={plant.image?.asset?.lqip}
                        sizes="(max-width: 799px) 144px, 700px"
                        image={plant.image}
                      />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          ) : 
          <ResponsiveImage  
            className={`featured-image w-full rounded-none bp-800:my-7`}
            wrapperClassName={`bp-800:mr-4 bp-800:w-[40%] max-w-3xl`}
            figureClassName={`rounded-none`}
            showCaption={false}
            captionBgClassName={`bg-oe-green-100`}
            blurDataURL={seasonData?.image?.asset?.lqip}
            sizes="(max-width: 799px) 144px, 700px"
            image={seasonData?.mainImage}
          />  
          }
        </section>
      )}
    </>
  )
}

export default Blooming
