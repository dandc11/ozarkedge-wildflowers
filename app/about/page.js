import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { stegaClean } from '@sanity/client/stega'

import { getUniqueImagesFromDocument } from '../../utilities/imageUtil'
// Dynamically import heavy client components to reduce initial compile size
const LightboxGallery = dynamic(() => import('../../components/LightboxGallery'))
const PortTextWrapper = dynamic(() => import('../../components/PortTextWrapper'))
import ResponsiveImage from '../../components/ResponsiveImage'
import WelcomeSection from '../../components/WelcomeSection'
import { GET_ABOUT_PAGE_DATA_QUERY } from '../../sanity/lib/queries'
import { sanityFetch } from '../../sanity/lib/sanity.live'
import { urlForImage } from '../../sanity/lib/sanity.image'

/**
 * Generates metadata for the about page using Sanity data.
 */
export async function generateMetadata() {
  const { data } = await sanityFetch({
    query: GET_ABOUT_PAGE_DATA_QUERY,
    stega: false,
  })
  const aboutPageData = data?.[0] ?? null
  const title = 'About Ozarkedge'
  const description = stegaClean(aboutPageData?.metaDescription) || undefined
  const ogImage = aboutPageData?.mainImage
    ? urlForImage(aboutPageData.mainImage, { width: 1200, height: 630 })?.url()
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

const AboutPage = async () => {
  const { isEnabled: isDraftMode } = await draftMode()
  const aboutQueryResponse = await sanityFetch({
    query: GET_ABOUT_PAGE_DATA_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  const aboutPageData = aboutQueryResponse?.data?.[0] ?? null
  const fullImageArray = getUniqueImagesFromDocument(aboutPageData)
  const docId = aboutPageData.id
  const docType = 'aboutPage'

  return (
    <>
      <Suspense>
        <LightboxGallery
          cols={3}
          images={fullImageArray}
          lightboxIdentifier="about"
          slideshow={true}
        />
      </Suspense>
      {aboutPageData && (
        <div
          className={`about-content nav-${stegaClean(aboutPageData.menuButtonColor)} overflow-hidden flex flex-col items-center relative`}
          key={aboutPageData.id}
        >
          <header className="header-section relative w-full">
            <ResponsiveImage
              image={aboutPageData.mainImage}
              alt={aboutPageData.mainImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              disablePointer
              loading="eager"
              figureClassName="h-full w-full"
              wrapperClassName="banner-img w-full"
              className="w-full h-full"
            />
            <ResponsiveImage
              image={aboutPageData.mobileImage}
              alt={aboutPageData.mobileImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              disablePointer
              loading="eager"
              figureClassName="h-full w-full"
              wrapperClassName="banner-img mobile w-full"
              className=""
            />
            <div className="about-banner-overlap">
              <div className="about-banner-card">
                <p className="about-banner-eyebrow">
                  <span className="about-banner-circle" aria-hidden="true" />
                  About Ozarkedge
                </p>
                <h1 className="about-banner-heading">
                  {aboutPageData.title || 'The people, the place, and the plants'}
                </h1>
                {aboutPageData.bannerStandfirst && (
                  <p className="about-banner-standfirst">{aboutPageData.bannerStandfirst}</p>
                )}
              </div>
            </div>
          </header>

          <WelcomeSection
            introPhoto={aboutPageData.introPhoto}
            ecoRegionMap={aboutPageData.ecoRegionMap}
            introBody={aboutPageData.introBody}
            locationBody={aboutPageData.locationBody}
            showButtons={false}
          />

          {aboutPageData.body && (
            <section className="our-story-section w-full">
              <hr className="our-story-rule" />
              <div className="our-story-inner">
                <div className="our-story-head">
                  <p className="our-story-eyebrow">
                    <span className="our-story-circle" aria-hidden="true" />
                    Our Story
                  </p>
                  <h2 className="our-story-heading">How Ozarkedge came to be</h2>
                </div>
                <Suspense>
                  <PortTextWrapper
                    lightboxIdentifier={'about'}
                    documentId={docId}
                    documentType={docType}
                    value={aboutPageData.body}
                  />
                </Suspense>
              </div>
            </section>
          )}
        </div>
      )}
    </>
  )
}

export default AboutPage
