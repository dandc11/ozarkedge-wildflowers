import React from 'react'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'

import ResponsiveImage from '../../../components/ResponsiveImage'
import LightboxGallery from '../../../components/LightboxGallery'
import NatureServeMessage from '../../../components/NatureServeMessage'
import NatureServeBadge from '../../../components/NatureServeBadge'
import ThumbnailGrid from '../../../components/ThumbnailGrid'
import GrowingNearby from '../../../components/GrowingNearbySection'
import Heading from '../../../components/Heading'
import PlantPageIntroSection from '../../../components/PlantPageIntroSection'
import ContentSection from '../../../components/ContentSection'
import { getUniqueImagesFromDocument } from '../../../utilities/imageUtil'
import { PLANT_PAGE_SECTIONS } from '../../../utilities/constants'
import { GET_ALL_NATIVE_PLANT_PATHS_QUERY, GET_PLANT_PAGE_DATA } from '../../../sanity/lib/queries'
import { client } from '../../../sanity/lib/sanity.client'
import { sanityFetch } from '../../../sanity/lib/sanity.live'

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: GET_ALL_NATIVE_PLANT_PATHS_QUERY,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
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
 * @param {Object} params - object with the slug of the plant page
 * @returns {JSX.Element} - plant page component
 *
 */
const NativePlantPage = async (props) => {
  const params = await props.params
  const [{ data: pageData }] = await Promise.all([
    sanityFetch({ query: GET_PLANT_PAGE_DATA, params }),
  ])

  // if (!pageData?._id) {
  //   return <div className="py-40">Loading...</div>
  // }

  const {
    bannerImage,
    bloomText,
    conservationStatus,
    conservationRanking,
    description,
    floweringSeason,
    growingNearbyText,
    growingNearbyPlantList,
    habitat,
    images,
    lede,
    menuButtonColor,
    mobileImage,
    plantName,
    pollinators,
    previewImage,
    tidbits,
  } = pageData

  const sectionLinks = getSectionLinks(pageData)
  const fullImageArray = getUniqueImagesFromDocument(pageData, ['growingNearbyPlantList'])
  const nsBadge = (
    <NatureServeBadge conservationRanking={conservationRanking} className={'inline-flex fs-lg'} />
  )

  const nsMessage = <NatureServeMessage conservationRanking={conservationRanking} />

  return (
    <div className={`plant-page bg-topography parallax nav-${stegaClean(menuButtonColor)}`}>
      {pageData && (
        <>
          {bannerImage && (
            <div id="bannerImage" className={`relative ${menuButtonColor}`}>
              <ResponsiveImage
                className={`relative w-full h-full cover`}
                figureClassName={`w-full`}
                image={bannerImage}
                breakpoint={'500'}
                disableHover
                disablePointer
                priority={true}
                placeholder={``}
                loading={`eager`}
                quality={`100`}
                showCaption={false}
                sizes={`100vw`}
                wrapperClassName={`banner-img w-full`}
              />
              <ResponsiveImage
                className={`relative w-full h-full cover`}
                figureClassName={`w-full`}
                image={mobileImage ? mobileImage : bannerImage}
                breakpoint={'500'}
                disableHover
                disablePointer
                priority={true}
                placeholder={``}
                loading={`eager`}
                quality={`100`}
                showCaption={false}
                sizes={`100vw`}
                wrapperClassName={`banner-img mobile w-full`}
              />
            </div>
          )}
          <header className="plant-page-header flex flex-col justify-center items-center">
            <PlantPageIntroSection
              bannerImage={bannerImage}
              lede={lede}
              plantName={plantName}
              tocLinks={sectionLinks}
              lightboxImgClass={`lightbox-img`}
            />
          </header>
          <main id="plantPageMainContent" className="w-full">
            <div className={`relative plant-page-grid`}>
              {fullImageArray && (
                <div id={`images`} className="right-sidebar flex flex-col items-center">
                  <LightboxGallery
                    cols={3}
                    images={fullImageArray}
                    lightboxIdentifier="plantPage"
                    showImageGrid
                    slideshow={true}
                  />

                  {/* <div className="sidebar-content-wrapper relative flex flex-col items-center"></div> */}
                </div>
              )}
              <article className="content-well">
                <ContentSection
                  className={`z-10`}
                  headingClassName={``}
                  portableText={plantName.nameInformation}
                  tocLinks={sectionLinks}
                  sectionId={`plantName`}
                  headerTitle={`PLANT NAME`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-9`}
                  headingClassName={``}
                  portableText={bloomText}
                  tocLinks={sectionLinks}
                  sectionId={`bloomText`}
                  headerTitle={`BLOOM`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-8`}
                  headingClassName={``}
                  portableText={description}
                  tocLinks={sectionLinks}
                  sectionId={`description`}
                  headerTitle={`DESCRIPTION`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-7`}
                  headingClassName={``}
                  portableText={pollinators}
                  tocLinks={sectionLinks}
                  sectionId={`pollinators`}
                  headerTitle={`POLLINATORS`}
                  lightboxIdentifier={`plantPage`}
                />
                <GrowingNearby
                  className={`z-6`}
                  headingClassName={``}
                  growingNearbyPlantImages={growingNearbyPlantList}
                  growingNearbyText={growingNearbyText}
                  sectionId={`growingNearby`}
                  tocLinks={sectionLinks}
                  lightboxIdentifier={`growningNearby`}
                />
                <ContentSection
                  className={`z-5`}
                  headingClassName={``}
                  portableText={habitat}
                  tocLinks={sectionLinks}
                  sectionId={`habitat`}
                  headerTitle={`HABITAT`}
                  lightboxIdentifier={`plantPage`}
                />

                <ContentSection
                  className={`z-4`}
                  headingClassName={``}
                  badge={nsBadge}
                  pretextComponent={nsMessage}
                  portableText={conservationStatus}
                  tocLinks={sectionLinks}
                  sectionId={`conservationStatus`}
                  headerTitle={`CONSERVATION STATUS`}
                  lightboxIdentifier={`plantPage`}
                ></ContentSection>
                <ContentSection
                  className={`z-3`}
                  headingClassName={``}
                  portableText={tidbits}
                  tocLinks={sectionLinks}
                  sectionId={`tidbits`}
                  headerTitle={`INTERESTING TIDBITS`}
                  lightboxIdentifier={`plantPage`}
                />
              </article>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

export default NativePlantPage
