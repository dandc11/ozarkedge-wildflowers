import React, { useState, useContext } from 'react'
import { getClient } from '../../lib/sanity.client'
import { readToken } from '../../lib/sanity.api'
import { useLiveQuery } from 'next-sanity/preview'
import {
  GET_ALL_NATIVE_PLANT_PATHS_QUERY,
  GET_PLANT_PAGE_DATA,
} from '../../lib/queries'
import { PLANT_PAGE_SECTIONS } from '../../utilities/constants'
import { getUniqueImagesFromDocument } from '../../utilities/imageUtil'
import PlantName from 'components/PlantName'
import Heading from 'components/Heading'
import ResponsiveImage from 'components/ResponsiveImage'
import PortTextWrapper from 'components/PortTextWrapper'
import TableOfContents from 'components/TableOfContents'
import cx from 'classnames'
import Button from 'components/Button'
import LightboxGallery from 'components/LightboxGallery'
import NatureServeMessage from 'components/NatureServeMessage'
import NatureServeBadge  from 'components/NatureServeBadge'
import ThumbnailGrid from 'components/ThumbnailGrid'
import ImageSlider from 'components/ImageSlider'
import ContentSection from 'components/ContentSection'
import { NavButtonColorContext } from 'contexts/NavButtonColorContext'

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
    <div
      className={`relative bg-white max-w-lg w-11/12 px-8 pt-2 shadow-sm bp-500:px-12 bp-1000:py-6 bp-1000:gap-8 bp-1000:max-w-full bp-1000:flex bp-700:py-3 bp-1000:w-fit z-10`}
    >
      <div className={`bp-1000:w-[30rem]`}>
        {plantName && (
          <div id={`header`} className={`relative block py-3`}>
            <PlantName
              topNameClassName={`bp-900:text-left bp-1200:text-3xl`}
              bottomNameClassName={`bp-900:text-left`}
              headingLevel={1}
              plantName={plantName}
            ></PlantName>
          </div>
        )}
        {lede && (
          <div id="lede">
            <PortTextWrapper
              className={`plant-pg-port-text`}
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

/**
 * GrowingNearby component - 6th section of plant page (growing nearby)
 * @param {Array} growingNearbyPlantImages - list of plants that grow nearby
 * @param {String} growingNearbyText - text about growing nearby
 * @param {Array} tocLinks - list of links for the table of contents
 * @param {String} isTableOfContentsOpen - section of the table of contents that is open
 * @param {Function} closeToC - function to set the table of contents
 * @param {Function} toggleLightboxCallback - function to toggle the lightbox
 * @returns {JSX.Element} - returns jsx of growing nearby section
 */
const GrowingNearby = ({
  className,
  growingNearbyPlantImages,
  growingNearbyText,
  tocLinks,
  toggleLightboxCallback,
  lightboxIdentifier,
}) => {
  return (
    <>
      {growingNearbyText && (
        <section
          id="growingNearbyText"
          className={cx('relative bg-oe-green-yelow-400', className)}
        >
          <div className="max-w-7xl m-auto">
            <Heading
              id={'growingNearbyText'}
              className={``}
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
    conservationRanking,
    description,
    flowerColor,
    floweringMonths,
    floweringSeason,
    growingNearbyText,
    growingNearbyPlantList,
    habitat,
    images,
    lede,
    menuButtonColor,
    plantName,
    pollinators,
    previewImage,
    tidbits,
  } = { ...pageData }


  const [navButtonColor, setNavButtonColor] = React.useContext(NavButtonColorContext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { setNavButtonColor(menuButtonColor)}, [menuButtonColor])
  const sectionLinks = getSectionLinks(pageData)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [startingSlideIndex, setStartingSlideIndex] = useState(0)
  const fullImageArray = getUniqueImagesFromDocument(pageData, [
    'growingNearbyPlantList',
  ])
  const nsBadge = 
    <NatureServeBadge
      conservationRanking={conservationRanking}
      className={'inline-flex text-lg'}
    />
  
  const nsMessage = <NatureServeMessage conservationRanking={conservationRanking} />

  // toggle lightbox, set starting slide index if opening
  const toggleLightbox = (key) => {
    if (key) {
      const index = fullImageArray.findIndex((e) => e.asset._ref === key)
      setStartingSlideIndex(index)
    }
    setIsLightboxOpen(!isLightboxOpen)
  }
  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }
  return (
    <div className="bg-topography">
      {pageData && (
        <>
          {(previewImage || bannerImage) && (
            <div id="bannerImage" className="relative">
              <ResponsiveImage
                className={`relative w-full h-full object-cover rounded-none bp-1200:object-[50%_35%] bp-1200:h-full`}
                figureClassName={`h-[36vh] bp-700:h-[60vh] bp-1600:h-[80vh]`}
                image={bannerImage}
                mobileImage={previewImage}
                breakpoint={'500'}
                disableHover
                disablePointer
                priority={true}
                placeholder={``}
                loading={`eager`}
                quality={`100`}
                showCaption={false}
                sizes={`100vw`}
                wrapperClassName={`w-full`}
              />
            </div>
          )}
          <header className="flex flex-col justify-center items-center -mt-12 bp-1400:-mt-48 bp-1400:justify-end bp-1400:flex-row bp-1400:pt-8 bp-1400:mr-[5cqi] bp-1600:-mt-56 transition-all duration-500 ease-in-out">
            <IntroSection
              bannerImage={bannerImage}
              lede={lede}
              plantName={plantName}
              tocLinks={sectionLinks}
              lightboxImgClass={`w-12`}
              lightboxCallback={toggleLightbox}
            />
          </header>
          <main id="plantPageMainContent" className="w-full">
            <div className={`relative plant-page pb-20`}>
              {fullImageArray && (
                <div
                  id={`images`}
                  className="flex flex-col items-center right-sidebar bp-1400:mt-14"
                >
                  <LightboxGallery
                    className={`px-4`}
                    cols={3}
                    lightboxImgClass={`h-[80vh]`}
                    images={fullImageArray}
                    lightboxIdentifier="plantPage"
                    onCloseCallback={closeLightbox}
                    open={isLightboxOpen}
                    slideshow={true}
                    showImageGrid={false}
                    startingSlideIndex={startingSlideIndex}
                  />
                  <div className="relative py-6 px-8 bp-1400:sticky top-10 flex flex-col items-center">
                    <Button
                      className={`btn-secondary my-8 max-w-[14rem] bp-1400:hidden`}
                      callBack={toggleLightbox}
                    >
                      View Image Gallery
                    </Button>
                    <p className='text-lg my-4 max-bp-1400:hidden'>More Images of {plantName.botanicalName}</p>
                    <ThumbnailGrid
                      assets={fullImageArray}
                      className={`max-bp-1400:hidden`}
                      cols={2}
                      maxItems={8}
                      thumbnailWidth={100}
                      onClick={toggleLightbox}
                      lightboxIdentifier={`plantPage`}
                    />
                  </div>
                  <div className="absolute top-0 h-full w-full rounded-md -z-10  bp-1400:bg-oe-green-400 opacity-70"></div>
                </div>
              )}
              <article className="content-well">
                <ContentSection
                  className={`z-[10]`}
                  headingClassName={`bp-900:mb-8`}
                  portableText={plantName.nameInformation}
                  tocLinks={sectionLinks}
                  sectionId={`plantName`}
                  headerTitle={`PLANT NAME`}
                  lightboxIdentifier={`plantPage`}
                  toggleLightboxCallback={toggleLightbox}
                />
                <ContentSection
                  className={`z-[9]`}
                  headingClassName={`bp-900:mb-8`}
                  portableText={bloomText}
                  tocLinks={sectionLinks}
                  sectionId={`bloomText`}
                  headerTitle={`BLOOM`}
                  lightboxIdentifier={`plantPage`}
                  toggleLightboxCallback={toggleLightbox}
                />
                <ContentSection
                  className={`z-[8]`}
                  headingClassName={`bp-900:mb-8`}
                  portableText={description}
                  tocLinks={sectionLinks}
                  sectionId={`description`}
                  headerTitle={`DESCRIPTION`}
                  lightboxIdentifier={`plantPage`}
                  toggleLightboxCallback={toggleLightbox}
                />
                <ContentSection
                  className={`z-[7]`}
                  headingClassName={`bp-900:mb-8`}
                  portableText={pollinators}
                  tocLinks={sectionLinks}
                  sectionId={`pollinators`}
                  headerTitle={`POLLINATORS`}
                  lightboxIdentifier={`plantPage`}
                  toggleLightboxCallback={toggleLightbox}
                />
                <GrowingNearby
                  className={`z-[6]`}
                  headingClassName={`bp-900:mb-8`}
                  growingNearbyPlantImages={growingNearbyPlantList}
                  growingNearbyText={growingNearbyText}
                  sectionId={`growingNearby`}
                  tocLinks={sectionLinks}
                  lightboxIdentifier={`growningNearby`}
                  toggleLightboxCallback={toggleLightbox}
                />
                <ContentSection
                  className={`z-[5]`}
                  headingClassName={`bp-900:mb-8`}
                  portableText={habitat}
                  tocLinks={sectionLinks}
                  sectionId={`habitat`}
                  headerTitle={`HABITAT`}
                  lightboxIdentifier={`plantPage`}
                  toggleLightboxCallback={toggleLightbox}
                />

                <ContentSection
                  className={`z-[4]`}
                  headingClassName={`mr-10 bp-900:mb-8`}
                  badge={nsBadge}
                  pretextComponent={nsMessage}
                  portableText={conservationStatus}
                  tocLinks={sectionLinks}
                  sectionId={`conservationStatus`}
                  headerTitle={`CONSERVATION STATUS`}
                  lightboxIdentifier={`plantPage`}
                  toggleLightboxCallback={toggleLightbox}
                ></ContentSection>
                <ContentSection
                  className={`z-[3]`}
                  headingClassName={`bp-900:mb-8`}
                  portableText={tidbits}
                  tocLinks={sectionLinks}
                  sectionId={`tidbits`}
                  headerTitle={`INTERESTING TIDBITS`}
                  lightboxIdentifier={`plantPage`}
                  toggleLightboxCallback={toggleLightbox}
                />
              </article>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  const client = getClient()
  const plantPagePaths = await client.fetch(GET_ALL_NATIVE_PLANT_PATHS_QUERY)
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
