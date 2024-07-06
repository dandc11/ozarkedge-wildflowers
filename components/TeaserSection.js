import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import PortTextWrapper from './PortTextWrapper'
import { getCurrentMonthName } from '../utilities/helperUtil'
import { SEASONS } from '../utilities/constants'
import { getClient } from '../lib/sanity.client'
import { GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY } from '../lib/queries'
import Link from 'next/link'
import Heading from './Heading'
import Button from './Button'
import ImageSlider from './ImageSlider'
import ResponsiveImage from './ResponsiveImage'

const TeaserSection = (props) => {
  const {
    bodyText = '',
    buttonLinkDocType,
    buttonLinkText = 'Learn More',
    teaserBodyClassName = '',
    id = '',
    images = [],
    gridClassName = '',
    headingId = '',
    headingChildren,
    headingClassName = '',
    link,
    showButton = true,
    maxImages,
    pullTextFromLink,
    pullImagesFromLink,
    sectionClassName = '',
    titleText,
    useLightBox,
    usePortText = true,
  } = props
  const currentMonth = getCurrentMonthName()
  const client = getClient()
  const headingText = headingChildren ? headingChildren : titleText ? titleText : ''
  let sliderImages
  let imagesQuery

  // useEffect(() => {
  //   client
  //     .fetch(GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY)
  //     .then((plantTeaserImages) => {
  //       setPlantTeaserImages(plantTeaserImages)
  //     })
  //     .catch((err) => {
  //       console.error('Oh no, error occured: ', err)
  //     })
  // }, [])
  console.log('plantTeaserImages', images)

  sliderImages = images
    .filter((img) => img.image)
    .map((img) => {
      img.image.caption = img.plantName?.commonName
      img.image.docType = 'nativePlant'
      img.image.slug = img.slug
      return img.image
    })

  return (
    <>
      <section
        id={id}
        className={cx(
          `teaser-section bp-800:flex justify-center w-full`,
          sectionClassName,
        )}
      >
        <div
          className={cx('teaser-section-grid w-full', gridClassName)}
        >
          {headingText && (
            <Heading
              id={headingId}
              className={headingClassName}
              headingClassName={`font-bold`}
              textTypeClass={``}
            >
              {headingText}
            </Heading>
          )}
          {images && (
            <ResponsiveImage
              image={images[0]}
              priority={false}
              disableHover
              showCaption={true}
              captionStyle='insetLeft'
              figureClassName={cx(
                `w-full`
              )}
              width={560}
              wrapperClassName={cx(`port-text-img teaser-img z-10` )}
            />
          )}
          <div className="teaser-bg"></div>
          <div className={cx(`teaser-body`, teaserBodyClassName)}>
            {bodyText && usePortText ? (
              <PortTextWrapper value={bodyText} components={{}} />
            ) : (
              <p>{bodyText}</p>
            )}
            {link && showButton && (
              <Button
                className={`btn-primary m-bk-5`}
                internalLink={link ? link : `/native-plants`}
                linkDocType={
                  buttonLinkDocType ? buttonLinkDocType : 'plantListPage'
                }
              >
                {buttonLinkText}
              </Button>
            )}
          </div>
        </div> 
      </section>
    </>
  )
}

export default TeaserSection
