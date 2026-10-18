import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import cx from 'classnames'

import { IMG_SIZES } from '../utilities/constants'
import { getCurrentMonthNumber, getPathFromDocType } from '../utilities/helperUtil'

import Heading from './Heading'
import ImageSlider from './ImageSlider'
import ResponsiveImage from './ResponsiveImage'
// SSR-friendly PortableText wrapper; heavy media blocks hydrate on client
const PortTextWrapper = dynamic(() => import('./PortTextWrapper'))

/**
 * @param {object} props - props for the component
 * @param {array} props.images - list of images to display in the slider
 * @param {string} props.headingChildren - children to pass to the Heading component
 * @param {string} props.bodyText - text to display - can be sting or portable text
 * @param {string} props.buttonLinkSlug - slug for the CTA link
 * @param {string} props.buttonLinkText - text for the CTA link
 * @param {string} props.buttonLinkDocType - doc type for the CTA link
 * @param {boolean} props.usePortText - whether to use the PortTextWrapper component for the body text
 * @param {boolean} props.showLinkButton - whether to show the CTA link
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
  const sliderPlants = (images ?? [])
    .filter((plant) => plant.image)
    .map((plant) => {
      plant.image.caption = plant.caption
      plant.image.docType = 'nativePlant'
      plant.image.slug = plant.slug
      return plant.image
    })

  const ctaHref = `${getPathFromDocType(buttonLinkDocType || 'plantListPage', buttonLinkSlug)}?${new URLSearchParams({ months: getCurrentMonthNumber() })}`
  return (
    <>
      {images && (
        <section id={id} className={cx(`teaser teaser-slider w-full`, className)}>
          <div
            className={cx('teaser-slider-grid', gridClassName, {
              'single-image': sliderPlants.length === 0,
            })}
          >
            <div className="teaser-text">
              {headingChildren && (
                <Heading id={headingId} className={headingClassName} textTypeClass="">
                  {headingChildren}
                </Heading>
              )}
              {bodyText && (
                <div className="description">
                  {usePortText ? (
                    <PortTextWrapper value={bodyText} components={{}} />
                  ) : (
                    <p>{bodyText}</p>
                  )}
                </div>
              )}
              {showLinkButton && buttonLinkText && (
                <div className="teaser-actions">
                  <Link className="link-cta" href={ctaHref}>
                    {buttonLinkText}{' '}
                    <span className="link-cta-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <div className="teaser-media">
              {sliderPlants.length > 0 ? (
                <ImageSlider
                  className={`teaser-image-slider`}
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
                  figureClassName="h-full w-full"
                  sizes={IMG_SIZES.TEASER}
                  wrapperClassName="teaser-image w-full bg-oe-green-yellow-200"
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default TeaserSlider
