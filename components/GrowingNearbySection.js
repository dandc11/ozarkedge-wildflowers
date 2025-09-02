'use client'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import { PLANT_PAGE_SECTIONS } from '../utilities/constants'

import Heading from './Heading'
import ImageSlider from './ImageSlider'
import PortTextWrapper from './PortTextWrapper'

/**
 * GrowingNearby component - 6th section of plant page (growing nearby)
 * @param {String} className - class name for the section
 * @param {String} documentId - the id of the document the component is being used in
 * @param {String} documentType = the doumcument type the component is being used in
 * @param {Array} growingNearbyPlantImages - list of plants that grow nearby
 * @param {String} growingNearbyText - text about growing nearby
 * @param {Array} tocLinks - list of links for the table of contents
 * @param {String} isTableOfContentsOpen - section of the table of contents that is open
 * @param {Function} closeToC - function to set the table of contents
 * @returns {JSX.Element} - returns jsx of growing nearby section
 */
const GrowingNearby = ({
  className,
  documentId,
  documentType,
  growingNearbyPlantImages,
  growingNearbyText,
  tocLinks,
}) => {
  return (
    <>
      {(growingNearbyPlantImages || growingNearbyText) && (
        <section id="growingNearby" className={cx('relative w-full', className)}>
          <div>
            <Heading
              id={'growingNearbyText'}
              className={`growing-nearby-heading`}
              showCircle
              tocLinks={tocLinks}
            >
              <span>{PLANT_PAGE_SECTIONS.growingNearbyText}</span>
            </Heading>
            {growingNearbyPlantImages && (
              <ImageSlider
                sliderImages={growingNearbyPlantImages}
                lightboxIdentifier={'growingNearby'}
                useLinks
              />
            )}
            {growingNearbyText && (
              <div>
                <PortTextWrapper
                  className={`plant-pg-port-text`}
                  documentId={documentId}
                  documentType={documentType}
                  lightboxIdentifier={'growingNearby'}
                  value={growingNearbyText}
                ></PortTextWrapper>
                <br></br>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}

export default GrowingNearby
