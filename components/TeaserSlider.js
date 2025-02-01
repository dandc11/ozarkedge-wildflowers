import React from 'react'
import cx from 'classnames'

import { getCurrentMonthName, getCurrentSeason, titleCase } from '../utilities/helperUtil'
import Heading from './Heading'
import PortTextWrapper from './PortTextWrapper'
import ImageSlider from './ImageSlider'
import Button from './Button'
import { CURRENT_MONTH_NUMBER, SEASONS } from '../utilities/constants'
import ResponsiveImage from './ResponsiveImage'

/**
 * @param {object} props - props for the component
 * @param {array} props.images - list of images to display in the slider
 * @param {string} props.headingChildren - children to pass to the Heading component
 * @param {string} props.bodyText - text to display - can be sting or portable text
 * @param {string} props.buttonLink - link for the button
 * @param {string} props.buttonLinkText - text for the button link
 * @param {string} props.buttonLinkDocType - doc type for the button link
 * @param {boolean} props.usePortText - whether to use the PortTextWrapper component for the body text
 * @param {boolean} props.showLinkButton - whether to show a link button
 * @param {string} props.className - class name for the component's outer element
 * @returns {JSX.Element} - the component
 * @category Components
 * **/

const TeaserSlider = (props) => {
  const {
    images,
    headingChildren,
    bodyText,
    buttonLinkSlug,
    buttonLinkText,
    buttonLinkDocType,
    defaultImage,
    id = '',
    headingId = '',
    headingClassName = '',
    usePortText = false,
    showLinkButton = true,
    lightboxIdentifier = '',
    className = '',
    gridClassName = '',
  } = props
  const thisMonth = getCurrentMonthName()
  const currentSeason = getCurrentSeason()?.SEASON_NAME
  let btnThemeClass
  switch (currentSeason) {
    case 'spring':
      btnThemeClass = 'btn-primary'
      break
    case 'summer':
      btnThemeClass = 'btn-secondary'
      break
    case 'fall':
      btnThemeClass = 'btn-3'
      break
    case 'winter':
      btnThemeClass = 'btn-4'
      break
    default:
      btnThemeClass = 'btn-primary'
  }
  const sliderPlants = images
    .filter((plant) => plant.image)
    .map((plant) => {
      plant.image.caption = plant.plantName?.commonName
      plant.image.docType = 'nativePlant'
      plant.image.slug = plant.slug
      return plant.image
    })
  // TODO: update this with dynamic params for more use cases
  const teaserUrlParams = { months: [CURRENT_MONTH_NUMBER] }
  return (
    <>
      {images && (
        <section
          id={id}
          className={cx(
            `teaser teaser-slider bp-800:flex justify-center w-full`,
            currentSeason,
            className,
          )}
        >
          <div
            className={cx('teaser-slider-grid p-4 w-full', gridClassName, {
              'single-image': sliderPlants.length === 0,
            })}
          >
            {headingChildren && (
              <Heading id={headingId} className={headingClassName} headingClassName={`font-bold`}>
                {headingChildren}
              </Heading>
            )}
            {sliderPlants.length > 0 ? (
              <ImageSlider
                className={`teaser-image-slider overflow-hidden`}
                sliderImages={sliderPlants}
                lightboxIdentifier={lightboxIdentifier}
                useLinks
              />
            ) : (
              <ResponsiveImage
                image={defaultImage}
                alt={defaultImage?.alt || 'A placeholder image'}
                disableHover
                disablePointer
                showCaption={false}
                loading="eager"
                figureClassName="h-full w-full"
                wrapperClassName="teaser-image rounded-lg w-full mb-3xl bg-oe-green-yellow-200"
                className="w-full h-full"
              />
            )}

            <div className={`description`}>
              {bodyText && usePortText ? (
                <PortTextWrapper value={bodyText} components={{}} />
              ) : (
                <p>{bodyText}</p>
              )}
              <Button
                className={cx(btnThemeClass, `m-bk-xl`)}
                slug={buttonLinkSlug}
                linkDocType={buttonLinkDocType ? buttonLinkDocType : 'plantListPage'}
                urlParams={teaserUrlParams}
              >
                {buttonLinkText}
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default TeaserSlider
