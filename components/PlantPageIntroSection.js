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
  const [isTableOfContentsOpen, setIszTableOfContentsOpen] = useState(false)
  closeToC = () => {
    setIsTableOfContentsOpen(!isTableOfContentsOpen)
  }
  return (
    <div
      className={`plant-intro relative bg-white max-w-lg w-11/12 px-8 pt-2 shadow-sm bp-500:px-12 bp-1000:py-6 bp-1000:gap-8 bp-1000:max-w-full bp-1000:flex bp-700:py-3 bp-1000:w-fit z-10`}
    >
      <div className={`header-title`}>
        {plantName && (
          <div className={`relative block p-bk-3`}>
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
      <div
        className={`flex flex-col justify-center bp-900:py-8 transition-all duration-500 ease-in-out bp-1000:justify-start bp-1000:mt-[.5rem]`}
      >
        <Button
          className={`bg-transparent w-auto self-center text-lg font-light not-italic uppercase antialiased flex justify-center items-center gap-2 mb-6 bp-1000:hidden`}
          strokeWidth={1}
          callBack={() => closeToC()}
          buttonIcon="expand"
          expanded={isTableOfContentsOpen}
        >
          Contents
        </Button>
        <TableOfContents
          showCircle
          shadow={false}
          listItemClassName={`mx-4 whitespace-nowrap text-lg`}
          className={cx(
            { 'max-bp-1000:hidden': !isTableOfContentsOpen },
            'max-bp-1000:pb-8 max-bp-1000:pt-2 bp-1000:pt-4 bp-1000:pl-4 ',
          )}
          toggleLightboxCallback={() => closeToC('intro')}
          links={tocLinks}
        />
      </div>
    </div>
  )
}

export default IntroSection
