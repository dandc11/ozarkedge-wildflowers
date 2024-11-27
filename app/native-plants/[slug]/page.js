import React from 'react'
import cx from 'classnames'

import ResponsiveImage from '../../../components/ResponsiveImage'
import Button from '../../../components/Button'
import LightboxGallery from '../../../components/LightboxGallery'
import NatureServeMessage from '../../../components/NatureServeMessage'
import NatureServeBadge from '../../../components/NatureServeBadge'
import ThumbnailGrid from '../../../components/ThumbnailGrid'
import GrowingNearby from '../../../components/GrowingNearbySection'
import PlantPageIntroSection from '../../../components/PlantPageIntroSection'
import ContentSection from '../../../components/ContentSection'
import ContextUpdater from '../../../components/ContextUpdater'
import { getUniqueImagesFromDocument } from '../../../utilities/imageUtil'
import { PLANT_PAGE_SECTIONS } from '../../../utilities/constants'
import {
  GET_ALL_NATIVE_PLANT_PATHS_QUERY,
  GET_PLANT_PAGE_DATA,
} from '../../lib/queries'
import { client } from '../../lib/sanity.client'

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
const NativePlantPage = async ({ params }) => {
  /**
   * TODO: 1. PREVIEW - useLiveQuery is a client-side hook, so this will not work in production - need to use Sanity's app router preview kit guide
   */

  const { slug } = params
  const pageData = await client.fetch(GET_PLANT_PAGE_DATA, { slug })

  const {
    bannerImage,
    bloomText,
    conservationStatus,
    conservationRanking,
    description,
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
  const fullImageArray = getUniqueImagesFromDocument(pageData, [
    'growingNearbyPlantList',
  ])
  const nsBadge = (
    <NatureServeBadge
      conservationRanking={conservationRanking}
      className={'inline-flex text-lg'}
    />
  )

  const nsMessage = (
    <NatureServeMessage conservationRanking={conservationRanking} />
  )

  return (
    <div className="plant-page bg-topography">
      {pageData && (
        <>
          <ContextUpdater navButtonColor={menuButtonColor} />
          {bannerImage && (
            <div id="bannerImage" className={`relative ${menuButtonColor}`}>
              <ResponsiveImage
                className={`relative w-full h-full object-cover bp-1200:object-[50%_35%] bp-1200:h-full`}
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
                className={`relative w-full h-full object-cover`}
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
              lightboxImgClass={`w-12`}
            />
          </header>
          <main id="plantPageMainContent" className="w-full">
            <div className={`relative plant-page-grid`}>
              {fullImageArray && (
                <div
                  id={`images`}
                  className="flex flex-col items-center right-sidebar bp-1400:mt-14"
                >
                  <LightboxGallery
                    cols={3}
                    images={fullImageArray}
                    lightboxIdentifier="plantPage"
                    showImageGrid
                    slideshow={true}
                  />

                  <div className="relative py-6 px-8 bp-1400:sticky top-10 flex flex-col items-center">
                    {/* <Button
                      className={`btn-secondary my-8 max-w-[14rem] bp-1400:hidden`}
                      callBack={toggleLightbox}
                    >
                      View Image Gallery
                    </Button> */}
                    <p className="text-lg my-4 max-bp-1400:hidden">
                      More Images of {plantName.botanicalName}
                    </p>
                    <ThumbnailGrid
                      assets={fullImageArray}
                      className={`max-bp-1400:hidden`}
                      cols={2}
                      maxItems={8}
                      thumbnailWidth={100}
                      lightboxIdentifier={`plantPage`}
                    />
                  </div>
                  <div className="absolute top-0 h-full w-full rounded-md -z-10  bp-1400:bg-oe-green-400 opacity-70"></div>
                </div>
              )}
              <article className="content-well">
                <ContentSection
                  className={`z-[10]`}
                  headingClassName={``}
                  portableText={plantName.nameInformation}
                  tocLinks={sectionLinks}
                  sectionId={`plantName`}
                  headerTitle={`PLANT NAME`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-[9]`}
                  headingClassName={``}
                  portableText={bloomText}
                  tocLinks={sectionLinks}
                  sectionId={`bloomText`}
                  headerTitle={`BLOOM`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-[8]`}
                  headingClassName={``}
                  portableText={description}
                  tocLinks={sectionLinks}
                  sectionId={`description`}
                  headerTitle={`DESCRIPTION`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-[7]`}
                  headingClassName={``}
                  portableText={pollinators}
                  tocLinks={sectionLinks}
                  sectionId={`pollinators`}
                  headerTitle={`POLLINATORS`}
                  lightboxIdentifier={`plantPage`}
                />
                <GrowingNearby
                  className={`z-[6]`}
                  headingClassName={``}
                  growingNearbyPlantImages={growingNearbyPlantList}
                  growingNearbyText={growingNearbyText}
                  sectionId={`growingNearby`}
                  tocLinks={sectionLinks}
                  lightboxIdentifier={`growningNearby`}
                />
                <ContentSection
                  className={`z-[5]`}
                  headingClassName={``}
                  portableText={habitat}
                  tocLinks={sectionLinks}
                  sectionId={`habitat`}
                  headerTitle={`HABITAT`}
                  lightboxIdentifier={`plantPage`}
                />

                <ContentSection
                  className={`z-[4]`}
                  headingClassName={`mr-10 `}
                  badge={nsBadge}
                  pretextComponent={nsMessage}
                  portableText={conservationStatus}
                  tocLinks={sectionLinks}
                  sectionId={`conservationStatus`}
                  headerTitle={`CONSERVATION STATUS`}
                  lightboxIdentifier={`plantPage`}
                ></ContentSection>
                <ContentSection
                  className={`z-[3]`}
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

export async function generateStaticParams() {
  const plantPagePaths = await client.fetch(GET_ALL_NATIVE_PLANT_PATHS_QUERY)
  return plantPagePaths.map((slug) => ({
    slug,
  }))
}

export default NativePlantPage
