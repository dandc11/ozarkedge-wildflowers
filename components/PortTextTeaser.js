import React from 'react'
import cx from 'classnames'
import classNames from 'classnames'

import ResponsiveImage from './ResponsiveImage'
import TeaserSlider from './TeaserSlider'
import TeaserSection from './TeaserSection'


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
  const { bodyText, buttonText, images, titleText, linkItems, teaserTheme} = props?.portTextProps
  
  return (
    <>
      <TeaserSection
        bodyText={bodyText}
        buttonText={buttonText}
        images={images}
        linkItems={linkItems}
        teaserTheme={teaserTheme}
        titleText={titleText}
        headingClassName={'p-in-4'}
        teaserBodyClassName={'p-bk-3 p-in-6'}
        sectionClassName={'full-width'}
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
