import React from 'react'
import cx from 'classnames'

import PortTextWrapper from './PortTextWrapper'
import {
  getCurrentMonthName,
  getMonthNumbersFromSeason,
} from '../utilities/helperUtil'
import { client } from '../app/lib/sanity.client'
import { GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY } from '../app/lib/queries'
import Heading from './Heading'
import Button from './Button'
import ResponsiveImage from './ResponsiveImage'

// JS Doc for TeaserSection
/** 
 * TeaserSection component - 
 * @property {string} [bodyText] - The body text for the teaser section
 * @property {string} [buttonText] - The text for the button
 * @property {string} [gridClassName] - The class name for the grid
 * @property {string} [headingClassName] - The class name for the heading
 * @property {string} [sectionClassName] - The class name for the section
 * @property {string} [teaserBodyClassName] - The class name for the teaser body
 * @property {string} [id] - The id for the section
 * @property {Array} [images] - The images for the teaser section
 * @property {string} [headingId] - The id for the heading
 * @property {string} [headingChildren] - The children for the heading
 * @property {Object} [linkItems] - The link items for the teaser section
 * @property {boolean} [showButton] - The boolean to show the button
 * @property {number} [maxImages] - The max number of images
 * @property {boolean} [pullTextFromLink] - The boolean to pull text from the link
 * @property {boolean} [pullImagesFromLink] - The boolean to pull images from the link
 * @property {string} [teaserTheme] - The theme for the teaser section
 * @property {string} [titleText] - The title text for the teaser section
 * @property {boolean} [useLightBox] - The boolean to use the lightbox
 * @property {boolean} [usePortText] - The boolean to use the port text
section
 */
const TeaserSection = (props) => {
  const {
    bodyText = '',
    buttonText = 'See More',
    gridClassName = '',
    headingClassName = '',
    sectionClassName = '',
    teaserBodyClassName = '',
    id = '',
    image,
    headingId = '',
    headingChildren,
    linkId,
    linkType,
    linkSlug,
    linkMetaDescription,
    linkMainImage,
    showButton = true,
    teaserTheme = 'spring',
    titleText,
    usePortText = true,
  } = props

  /**
   * TODO:
   * - Revisit Teaser/Feature components to see if they can be combined
   * - Add support for multiple images
   * - Add support for url params
   * - Add support for teaser theme
   */

  const currentMonth = getCurrentMonthName()
  const headingText = headingChildren
    ? headingChildren
    : titleText
      ? titleText
      : ''
  let teaserUrlParams

  return (
    <>
      <section
        id={id}
        className={cx(`teaser feature w-full`, sectionClassName, teaserTheme)}
      >
        <div className={cx('feature-layout-grid w-full', gridClassName)}>
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
          {image && (
            <ResponsiveImage
              image={image}
              priority={false}
              disableHover
              disablePointer
              showCaption={true}
              captionStyle="insetLeft"
              figureClassName={cx(`w-full`)}
              width={560}
              wrapperClassName={cx(`port-text-img teaser-img`)}
            />
          )}
          <div className="teaser-bg"></div>
          <div className={cx(`teaser-body`, teaserBodyClassName)}>
            {bodyText && usePortText && Array.isArray(bodyText) ? (
              <PortTextWrapper value={bodyText} components={{}} />
            ) : (
              <p>{bodyText}</p>
            )}
            {linkType && showButton && (
              <Button
                className={`btn-primary m-bk-5`}
                linkDocType={linkType}
                slug={linkSlug}
                urlParams={teaserUrlParams}
              >
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default TeaserSection
