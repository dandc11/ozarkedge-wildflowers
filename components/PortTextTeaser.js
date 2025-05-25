import React from 'react'
import cx from 'classnames'

import TeaserSection from './TeaserSection'

// JS Docs
/**
 * @typedef {Object} PortTextProps
 * @property {string} bodyText - The body text of the teaser
 * @property {string} buttonText - The button text of the teaser
 * @property {string} image - The image of the teaser
 * @property {string} titleText - The title text of the teaser
 * @property {string} teaserTheme - The theme of the teaser
 * @property {string} linkItems - The link items of the teaser
 */
const PortTextTeaser = (props) => {
  const { portTextProps } = props
  const { bodyText, buttonText, image, titleText, linkItems, teaserTheme } = portTextProps
  return (
    <div className={cx(`port-text-teaser flex justify-center m-bk-lg`)}>
      <div className={cx(`w-full`, widthClass)}>
        <TeaserSection
          bodyText={bodyText}
          buttonText={buttonText}
          image={image}
          linkItems={linkItems}
          teaserTheme={teaserTheme}
          titleText={titleText}
          sectionClassName={'full-width'}
        />
      </div>
    </div>
  )
}

export default PortTextTeaser
