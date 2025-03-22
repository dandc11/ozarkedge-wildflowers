'use client'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import { PLANT_PAGE_SECTIONS } from '../utilities/constants'
import { GET_NATIVE_PLANT_NAMES_AND_SLUGS_QUERY } from '../sanity/lib/queries'
import { client } from '../sanity/lib/sanity.client'
import Heading from './Heading'
import ImageSlider from './ImageSlider'
import PortTextWrapper from './PortTextWrapper'

/**
 * GrowingNearby component - 6th section of plant page (growing nearby)
 * @param {String} className - class name for the section
 * @param {Array} growingNearbyPlantImages - list of plants that grow nearby
 * @param {String} growingNearbyText - text about growing nearby
 * @param {Array} tocLinks - list of links for the table of contents
 * @param {String} isTableOfContentsOpen - section of the table of contents that is open
 * @param {Function} closeToC - function to set the table of contents
 * @returns {JSX.Element} - returns jsx of growing nearby section
 */
const GrowingNearby = ({ className, growingNearbyPlantImages, growingNearbyText, tocLinks }) => {
  const [nativePlantNamesAndSlugs, setNativePlantNamesAndSlugs] = useState([])

  // useEffect(() => {
  //   const fetchNativePlantNamesAndSlugs = async () => {
  //     const nativePlantDocs = await client.fetch(GET_NATIVE_PLANT_NAMES_AND_SLUGS_QUERY)
  //     console.log('nativePlantDocs', nativePlantDocs)
  //     setNativePlantNamesAndSlugs(nativePlantDocs)
  //   }

  //   fetchNativePlantNamesAndSlugs()
  // }, [])
  // console.log('growingNearbyPlantImages', growingNearbyPlantImages)

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
