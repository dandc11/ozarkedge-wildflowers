'use client'
import React, { useState } from 'react'
import cx from 'classnames'

import PlantName from './PlantName'
import PortTextWrapper from './PortTextWrapper'
import TableOfContents from './TableOfContents'
import Button from './Button'

/**
 * IntroSection component - 1st section of plant page (intro text)
 * @param {lede} lede - lede text
 * @param {plantName} plantName - plant name object
 * @param {closeToC} closeToC - function to set currently open table of contents section
 * @param {tocLinks} tocLinks - table of contents links
 * @returns {JSX.Element} - IntroSection component JSX
 * @example
 *  <IntroSection
 *    lede={lede}
 *    plantName={plantName}
 *    closeToC={closeToC}
 *    tocLinks={tocLinks}
 *  />
 */
const IntroSection = ({
  lede,
  plantName,
  closeToC,
  tocLinks,
  lightboxCallback,
  lightboxIdentifier,
}) => {
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false)
  closeToC = () => {
    setIsTableOfContentsOpen(!isTableOfContentsOpen)
  }
  return (
    <div className={`plant-intro relative flex flex-col`}>
      <div className={`header-title`}>
        {plantName && (
          <div className={`relative block p-bk-sm`}>
            <PlantName
              topNameClassName={`fs-xl text-center `}
              bottomNameClassName={`italic text-center `}
              headingLevel={1}
              plantName={plantName}
            ></PlantName>
          </div>
        )}
        {lede && (
          <div id="lede">
            <PortTextWrapper
              className={`plant-pg-port-text p-0`}
              value={lede}
              lightboxCallback={lightboxCallback}
              lightboxIdentifier={lightboxIdentifier}
            ></PortTextWrapper>
            <br></br>
          </div>
        )}
      </div>
      <div className={`toc-wrapper flex flex-col justify-center transition-all`}>
        <Button
          className={`self-center fs-lg fw-300 uppercase flex justify-center`}
          strokeWidth={1}
          callBack={() => closeToC()}
          buttonIcon="expand"
          expanded={isTableOfContentsOpen}
        >
          Contents
        </Button>
        <TableOfContents
          shadow={false}
          listItemClassName={``}
          className={cx({ 'toc-hidden': !isTableOfContentsOpen })}
          toggleLightboxCallback={() => closeToC('intro')}
          links={tocLinks}
        />
      </div>
    </div>
  )
}

export default IntroSection
