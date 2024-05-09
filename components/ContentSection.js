import React, { useState } from 'react'
import cx from 'classnames'
import Heading from './Heading'
import PortTextWrapper from './PortTextWrapper'

/**
 * ContentSection component - renders a content section containing a Heading and (portable) text. Accepts table of contents props for Heading.
 * Created 07/01/23
 * @param {string} bodyClassName - class name for body
 * @param {string} className - class name for section
 * @param {children} children - children components
 * @param {string} headingClassName - class name for header
 * @param {string} headerTitle - title of section (for display)
 * @param {string} lightboxIdentifier - identifier for lightbox.js
 * @param {function} toggleLightboxCallback - function to toggle lightbox
 * @param {JSX} badge - badge to render next to header
 * @param {JSX} pretextComponent - component to render before portable text
 * @param {array} portableText - array of objects with text and markup for portable text
 * @param {string} sectionId - id of section (for section ID and ToC)
 * @param {array} tocLinks - array of objects with link and text for table of contents
 * @returns {JSX} - returns jsx of content section
 */
const ContentSection = ({
  badge = null,
  bodyClassName = '',
  children,
  className = '',
  headingClassName = '',
  headerTitle = '',
  lightboxIdentifier = '',
  portableText,
  pretextComponent,
  sectionId = '',
  showCircle = true,
  toggleLightboxCallback = () => {},
  tocLinks,
}) => {
  const [displayPretextComponent, setDisplayPretextComponent] = useState(false)
  return (
    <>
      {portableText && (
        <section className={cx('relative', className)}>
          <Heading
            id={sectionId}
            title={headerTitle}
            headingClassName={headingClassName}
            showCircle={showCircle}
            tocLinks={tocLinks}
          >
            <div className="flex flex-col gap-3 bp-600:flex-row">
              {headerTitle} {badge && React.cloneElement(badge, {showMoreInfoSection: setDisplayPretextComponent})}
            </div>
          </Heading> 
          <div>
          {displayPretextComponent && pretextComponent}
            <PortTextWrapper
              lightboxCallback={toggleLightboxCallback}
              lightboxIdentifier={lightboxIdentifier}
              className={cx('', bodyClassName)}
              value={portableText}
            ></PortTextWrapper>
            <br></br>
            {children}
          </div>
        </section>
      )}
    </>
  )
}

export default ContentSection
