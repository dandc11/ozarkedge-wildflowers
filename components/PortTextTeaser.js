import React from 'react'
import ResponsiveImage from './ResponsiveImage'
import cx from 'classnames'
import TeaserSlider from './TeaserSlider'
import TeaserSection from './TeaserSection'
import classNames from 'classnames'

// JSDoc definitions
/**
 * PortTextTeaser component for use within Portable Text blocks - renders a figure with an image and caption. Accepts lightbox props for ResponsiveImage.
 * Created 07/01/23
 * @param {object} portTextProps - object with image and caption for figure
 * @param {string} lightboxIdentifier - identifier for lightbox.js
 * @param {function} lightboxCallback - function to toggle lightbox
 * @returns {JSX} - returns jsx of figure
 * @category Components
 * @example
 * <PortTextTeaser
 * portTextProps={portTextProps}
 * lightboxIdentifier={lightboxIdentifier}
 * lightboxCallback={lightboxCallback}
 * />
 */
const PortTextTeaser = (props) => {
  const { bodyText, images, link, titleText } = props?.portTextProps
  return (
    <>
      <TeaserSection
        bodyText={bodyText}
        images={images}
        link={link}
        titleText={titleText}
        headingClassName={'p-in-4'}
        teaserBodyClassName={'p-bk-3 p-in-6'}
        sectionClassName={'full-width'}
        buttonLinkText={'Learn More'}
      />
      {/* <TeaserSlider
        id={id}
        images={images}
        headingChildren={<BloomingHeadingText thisMonth={thisMonth} />}
        headingId={headingId}
        headingClassName={headingClassName}
        bodyText={bodyText}
        buttonLink={buttonLink}
        buttonLinkDocType={buttonLinkDocType}
        buttonLinkText={buttonLinkText}
        lightboxIdentifier={lightboxIdentifier}
        className={classNames}
        usePortText
      /> */}
    </>
  )
}

export default PortTextTeaser
