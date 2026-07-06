import React from 'react'
import { draftMode } from 'next/headers'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'
import { notFound } from 'next/navigation'

import ResponsiveImage from '../../../components/ResponsiveImage'
import LightboxGallery from '../../../components/LightboxGallery'
import NatureServeMessage from '../../../components/NatureServeMessage'
import NatureServeBadge from '../../../components/NatureServeBadge'
import GrowingNearby from '../../../components/GrowingNearbySection'
import PlantPageIntroSection from '../../../components/PlantPageIntroSection'
import ContentSection from '../../../components/ContentSection'
import { getUniqueImagesFromDocument } from '../../../utilities/imageUtil'
import { PLANT_PAGE_SECTIONS, IMG_SIZES } from '../../../utilities/constants'
import { GET_ALL_NATIVE_PLANT_PATHS_QUERY, GET_PLANT_PAGE_DATA } from '../../../sanity/lib/queries'
import { sanityFetch } from '../../../sanity/lib/sanity.live'
import { urlForImage } from '../../../sanity/lib/sanity.image'
import { editAttribute } from '../../../sanity/lib/editAttribute'

/**
 * Generates metadata for an individual plant page using Sanity data.
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: pageData } = await sanityFetch({
    query: GET_PLANT_PAGE_DATA,
    params: resolvedParams,
    stega: false,
  })

  if (!pageData?._id) {
    return { title: 'Plant Not Found' }
  }

  // Use first array items for metadata
  const commonName = Array.isArray(pageData.plantName?.commonName)
    ? stegaClean(pageData.plantName.commonName[0])
    : stegaClean(pageData.plantName?.commonName) || 'Native Plant'
  const botanicalName = Array.isArray(pageData.plantName?.botanicalName)
    ? stegaClean(pageData.plantName.botanicalName[0])
    : stegaClean(pageData.plantName?.botanicalName) || ''
  const title = botanicalName ? `${commonName} (${botanicalName})` : commonName
  const description = stegaClean(pageData.metaDescription) || undefined
  const ogImageSource = pageData.bannerImage || pageData.previewImage
  const ogImage = ogImageSource
    ? urlForImage(ogImageSource, { width: 1200, height: 630 })?.url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

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
  const slugs = Array.isArray(data) ? data : []
  return slugs
    .filter(Boolean)
    .map((slug) => (typeof slug === 'string' ? { slug } : { slug: slug?.slug }))
    .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
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
  const { isEnabled: isDraftMode } = await draftMode()
  const params = await props.params
  const [{ data: pageData }] = await Promise.all([
    sanityFetch({
      query: GET_PLANT_PAGE_DATA,
      params,
      perspective: isDraftMode ? 'drafts' : 'published',
      stega: isDraftMode,
    }),
  ])

  if (!pageData?._id) {
    notFound()
  }

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
  const docId = pageData._id
  const docType = 'nativePlant'
  const sectionLinks = getSectionLinks(pageData)
  const fullImageArray = getUniqueImagesFromDocument(pageData, ['growingNearbyPlantList'])
  const ranking = stegaClean(conservationRanking)
  const nsBadge = <NatureServeBadge conservationRanking={ranking} className={'inline-flex fs-lg'} />
  const nsMessage = <NatureServeMessage conservationRanking={ranking} />

  return (
    <div className={`plant-page bg-topography parallax nav-${stegaClean(menuButtonColor)}`}>
      {pageData && (
        <>
          {bannerImage && (
            <div id="bannerImage" className={`relative ${menuButtonColor}`}>
              <ResponsiveImage
                className={`relative w-full h-full cover`}
                disableHover
                disablePointer
                fetchPriority="high"
                figureClassName={`w-full`}
                image={bannerImage}
                priority
                placeholder={``}
                showCaption={false}
                quality={85}
                sizes={IMG_SIZES.HERO_DESKTOP_SIZES}
                wrapperClassName={`banner-img w-full`}
                data-sanity-edit-target="true"
                data-sanity={editAttribute(docId, docType, 'bannerImage')}
              />
              <ResponsiveImage
                className={`relative w-full h-full cover`}
                figureClassName={`w-full`}
                image={mobileImage ? mobileImage : bannerImage}
                breakpoint={'500'}
                disableHover
                disablePointer
                fetchPriority="high"
                priority
                placeholder={``}
                quality={85}
                sizes={IMG_SIZES.HERO_MOBILE_SIZES}
                showCaption={false}
                wrapperClassName={`banner-img mobile w-full`}
                data-sanity-edit-target="true"
                data-sanity={editAttribute(docId, docType, 'mobileImage')}
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
                  documentId={docId}
                  documentType={docType}
                  sectionId={`plantName`}
                  portableTextFieldName={`plantName`}
                  headerTitle={`PLANT NAME`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-9`}
                  headingClassName={``}
                  portableText={bloomText}
                  documentId={docId}
                  documentType={docType}
                  tocLinks={sectionLinks}
                  sectionId={`bloomText`}
                  portableTextFieldName={`bloomText`}
                  headerTitle={`BLOOM`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-8`}
                  headingClassName={``}
                  portableText={description}
                  documentId={docId}
                  documentType={docType}
                  tocLinks={sectionLinks}
                  sectionId={`description`}
                  portableTextFieldName={`description`}
                  headerTitle={`DESCRIPTION`}
                  lightboxIdentifier={`plantPage`}
                />
                <ContentSection
                  className={`z-7`}
                  headingClassName={``}
                  portableText={pollinators}
                  documentId={docId}
                  documentType={docType}
                  tocLinks={sectionLinks}
                  sectionId={`pollinators`}
                  portableTextFieldName={`pollinators`}
                  headerTitle={`POLLINATORS`}
                  lightboxIdentifier={`plantPage`}
                />
                <GrowingNearby
                  className={`z-6`}
                  headingClassName={``}
                  growingNearbyPlantImages={growingNearbyPlantList}
                  growingNearbyText={growingNearbyText}
                  documentId={docId}
                  documentType={docType}
                  sectionId={`growingNearby`}
                  portableTextFieldName={`growingNearbyText`}
                  tocLinks={sectionLinks}
                  lightboxIdentifier={`growningNearby`}
                />
                <ContentSection
                  className={`z-5`}
                  headingClassName={``}
                  portableText={habitat}
                  documentId={docId}
                  documentType={docType}
                  tocLinks={sectionLinks}
                  sectionId={`habitat`}
                  portableTextFieldName={`habitat`}
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
                  documentId={docId}
                  documentType={docType}
                  sectionId={`conservationStatus`}
                  portableTextFieldName={`conservationStatus`}
                  headerTitle={`CONSERVATION STATUS`}
                  lightboxIdentifier={`plantPage`}
                ></ContentSection>
                <ContentSection
                  className={`z-3`}
                  headingClassName={``}
                  portableText={tidbits}
                  documentId={docId}
                  documentType={docType}
                  tocLinks={sectionLinks}
                  sectionId={`tidbits`}
                  portableTextFieldName={`tidbits`}
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
