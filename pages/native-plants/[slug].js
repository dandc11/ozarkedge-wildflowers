import React, { useState, useEffect, useRef } from 'react'
import { getClient } from '../../lib/sanity.client'
import { readToken } from '../../lib/sanity.api'
import { useLiveQuery } from 'next-sanity/preview'
import {
  GET_ALL_NATIVE_PLANT_PATHS_QUERY,
  GET_PLANT_PAGE_DATA,
} from '../../lib/queries'

import { PLANT_PAGE_SECTIONS } from '../../utilities/constants'
import PlantName from 'components/PlantName'
import Header from 'components/Header'
import ResponsiveImage from 'components/ResponsiveImage'
import PortTextWrapper from 'components/PortableText'
import TableOfContents from 'components/TableOfContents'
import cx from 'classnames'
import Button from 'components/Button'
import Lightbox from 'components/Lightbox'
import ThumbnailGrid from 'components/ThumbnailGrid'
import ImageSlider from 'components/ImageSlider'
import ContentSection from 'components/ContentSection'

/**
 * IntroSection component - 1st section of plant page (intro text)
 * @param {lede} lede - lede text
 * @param {isTableOfContentsOpen} isTableOfContentsOpen - currently open table of contents section
 * @param {plantName} plantName - plant name object
 * @param {closeToC} closeToC - function to set currently open table of contents section
 * @param {tocLinks} tocLinks - table of contents links
 * @returns {JSX.Element} - IntroSection component JSX
 * @example
 *  <IntroSection
 *    lede={lede}
 *    isTableOfContentsOpen={isTableOfContentsOpen}
 *    plantName={plantName}
 *    closeToC={closeToC}
 *    tocLinks={tocLinks}
 *  />
 */
const IntroSection = ({
  lede,
  isTableOfContentsOpen,
  plantName,
  closeToC,
  tocLinks,
}) => {
  closeToC = closeToC || (() => {})
  return (
    <div
      className={`relative bg-white max-w-lg w-11/12 bp-700:max-w-full bp-700:flex bp-700:py-3 bp-900:w-fit bp-900:ml-3 z-10 bp-1200:px-5 bp-1200:py-3  bp-1600:py-6`}
    >
      <div className={`px-6 bp-500:px-8 bp-900:w-[30rem] bp-900:mr-4`}>
        {plantName && (
          <div id={`header`} className={`relative block py-3`}>
            <PlantName
              topNameClassName={`bp-700:text-left bp-1200:text-3xl`}
              bottomNameClassName={`bp-700:text-left`}
              plantName={plantName}
            ></PlantName>
          </div>
        )}
        {lede && (
          <div id="lede">
            <PortTextWrapper
              className={`plant-pg-port-text`}
              value={lede}
            ></PortTextWrapper>
            <br></br>
          </div>
        )}
      </div>
      <div className={`pt-6 `}>
        <TableOfContents
          showHeader
          showCircle
          shadow={false}
          headerClassName={`mb-3`}
          listItemClassName={`mx-4 whitespace-nowrap`}
          className={cx({
            'max-[700px]:hidden': isTableOfContentsOpen !== 'intro',
          })}
          toggleLightboxCallback={() => closeToC('intro')}
          links={tocLinks}
        />
        <Button
          className={`bg-transparent w-full self-center bp-700:hidden`}
          callBack={() => closeToC('intro')}
          buttonIcon="expand"
          expanded={isTableOfContentsOpen === 'intro'}
        ></Button>
      </div>
    </div>
  )
}

/**
 * GrowingNearby component - 6th section of plant page (growing nearby)
 * @param {Array} growingNearbyPlantList - list of plants that grow nearby
 * @param {String} growingNearbyText - text about growing nearby
 * @param {Array} tocLinks - list of links for the table of contents
 * @param {String} isTableOfContentsOpen - section of the table of contents that is open
 * @param {Function} closeToC - function to set the table of contents
 * @param {Function} toggleLightboxCallback - function to toggle the lightbox
 * @returns {JSX.Element} - returns jsx of growing nearby section
 */
const GrowingNearby = ({
  growingNearbyPlantList,
  growingNearbyText,
  tocLinks,
  toggleLightboxCallback,
}) => {
  const plantImages = growingNearbyPlantList?.map((plant) => {
    return {
      image: plant.previewImage,
      slug: plant.slug,
      docType: plant.docType,
    }
  })

  return (
    <>
      {growingNearbyText && (
        <section
          id="growingNearbyText"
          className={cx(
            'relative bg-oe-green-yelow-400'
            // {
            //     'z-10':
            //         isTableOfContentsOpen ===
            //         PLANT_PAGE_SECTIONS.growingNearbyText,
            //     'z-0':
            //         isTableOfContentsOpen !==
            //         PLANT_PAGE_SECTIONS.growingNearbyText,
            // }
          )}
        >
          <div className="max-w-7xl m-auto">
            <Header
              id={'growingNearbyText'}
              className={``}
              showCircle
              tocLinks={tocLinks}
            >
              <span>{PLANT_PAGE_SECTIONS.growingNearbyText}</span>
            </Header>
            <ImageSlider
              sliderItems={plantImages}
              useLinks
              captionBgClassName={'bg-oe-green-yellow-200'}
            />
            <div>
              <PortTextWrapper
                lightboxCallback={toggleLightboxCallback}
                className={`plant-pg-port-text`}
                value={growingNearbyText}
              ></PortTextWrapper>
              <br></br>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// get links to section ids for the sections with content
const getSectionLinks = (pageData) => {
  // console.log('pageData ', pageData)
  let tableOfContents = {}
  for (const section in PLANT_PAGE_SECTIONS) {
    if (pageData && pageData[section]) {
      tableOfContents[section] = PLANT_PAGE_SECTIONS[section]
    }
  }
  return tableOfContents
}

/**
 * Plant page component - renders all sections of the plant page
 * @param {object} pageData - data for the plant page
 * @returns {JSX.Element} - plant page component
 *
 */
const NativePlantPage = (props) => {
  const { pageProps = null } = props
  const [pageData] = useLiveQuery(pageProps, GET_PLANT_PAGE_DATA)
  const {
    bannerImage,
    bloomText,
    conservationStatus,
    description,
    flowerColor,
    floweringMonths,
    floweringSeason,
    growingNearbyText,
    growingNearbyPlantList,
    habitat,
    images,
    lede,
    plantName,
    pollinators,
    previewImage,
    tidbits,
  } = { ...pageData }
  const sectionLinks = getSectionLinks(pageData)
  const tableOfContentsRef = useRef(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false)
  const toggleLightbox = () => {
    setIsLightboxOpen(!isLightboxOpen)
  }
  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }
  return (
    <div className="bg-topography pb-10">
      {pageData && (
        <>
          {(previewImage || bannerImage) && (
            <div id="bannerImage" className="relative">
              <ResponsiveImage
                className={`relative w-full bp-1200:object-cover bp-1200:object-center bp-1200:h-full`}
                figureClassName={`w-full rounded-none bp-1600:h-[80vh]`}
                // height={`auto`}
                // width={`auto`}
                image={bannerImage}
                mobileImage={previewImage}
                breakpoint={'500'}
                priority={true}
                placeholder={``}
                quality={`100`}
                showCaption={false}
                sizes={`100vw`}
                wrapperClassName={`w-full`}
              />
            </div>
          )}
          <header className="flex flex-col justify-center items-center -mt-12 bp-700:-mt-24 bp-900:justify-around bp-1200:gap-4 bp-1200:flex-row bp-1200:max-w-fit bp-1200:ml-auto bp-1200:mr-auto bp-1200:pt-8">
            <IntroSection
              bannerImage={bannerImage}
              lede={lede}
              plantName={plantName}
              tocLinks={sectionLinks}
              lightboxImgClass={`w-12`}
            />
            <div className="max-w-md bp-1200:self-end bp-1200:pt-4 bp-1400:ml-4 bp-1600:ml-14">
              {images && (
                <div id={`images`} className="flex flex-col items-center">
                  <ThumbnailGrid
                    className={`relative z-0 flex flex-col gap-4 mt-8 px-4`}
                    assets={images}
                    cols={3}
                    thumbnailWidth={100}
                    maxItems={6}
                    lightboxIdentifier={`plantPage`}
                  />
                  <Button
                    className={`btn-secondary w-10 mt-6 mb-10 bp-1200:mb-0`}
                    callBack={() => toggleLightbox()}
                  >
                    View All Images
                  </Button>
                </div>
              )}
            </div>
          </header>
          <main id="plantPageMainContent w-full">
            <div className={`relative content-well`}>
              <ContentSection
                className={`px-[min(10vw, 3rem)]`}
                portableText={plantName.nameInformation}
                tocLinks={sectionLinks}
                sectionId={`plantName`}
                headerTitle={`PLANT NAME`}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />
              <ContentSection
                portableText={bloomText}
                tocLinks={sectionLinks}
                sectionId={`bloomText`}
                headerTitle={`BLOOM`}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />
              <ContentSection
                portableText={description}
                tocLinks={sectionLinks}
                sectionId={`description`}
                headerTitle={`DESCRIPTION`}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />

              <ContentSection
                portableText={pollinators}
                tocLinks={sectionLinks}
                sectionId={`pollinators`}
                headerTitle={`POLLINATORS`}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />
              <GrowingNearby
                growingNearbyPlantList={growingNearbyPlantList}
                growingNearbyText={growingNearbyText}
                sectionId={`growingNearby`}
                tocLinks={sectionLinks}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />
              <ContentSection
                portableText={habitat}
                tocLinks={sectionLinks}
                sectionId={`habitat`}
                headerTitle={`HABITAT`}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />
              <ContentSection
                portableText={conservationStatus}
                tocLinks={sectionLinks}
                sectionId={`conservationStatus`}
                headerTitle={`CONSERVATION STATUS`}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />
              <ContentSection
                portableText={tidbits}
                tocLinks={sectionLinks}
                sectionId={`tidbits`}
                headerTitle={`INTERESTING TIDBITS`}
                lightboxIdentifier={`plantPage`}
                toggleLightboxCallback={() => toggleLightbox()}
              />
            </div>
          </main>
          <Lightbox
            cols={3}
            images={images}
            lightboxIdentifier="plantPage"
            maxItems={6}
            onOpenCallback={toggleLightbox}
            onCloseCallback={closeLightbox}
            open={isLightboxOpen}
            slideshow={true}
            thumbnailWidth={150}
          />
        </>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  const client = getClient();
  const plantPagePaths = await client.fetch(GET_ALL_NATIVE_PLANT_PATHS_QUERY);
  const paths = plantPagePaths.map((slug) => ({
    params: { slug },
  }))

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const { draftMode = false, params = {} } = context
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const { slug = '' } = params
  const pageProps = await client.fetch(GET_PLANT_PAGE_DATA, { slug })
  return {
    props: {
      pageProps,
    },
  }
}

export default NativePlantPage
