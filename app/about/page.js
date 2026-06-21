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
import { GET_ABOUT_PAGE_DATA_QUERY, GET_WELCOME_SECTION_QUERY } from '../../sanity/lib/queries'
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

  const welcomeQueryResponse = await sanityFetch({
    query: GET_WELCOME_SECTION_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  const welcomeData = welcomeQueryResponse?.data ?? null

  const fullImageArray = getUniqueImagesFromDocument(aboutPageData)
  const docId = aboutPageData._id
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
          key={aboutPageData._id}
        >
          <h1 className="sr-only">About Ozarkedge</h1>
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
              image={aboutPageData.mobileImage ? aboutPageData.mobileImage : aboutPageData.mainImage}
              alt={aboutPageData.mobileImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              disablePointer
              loading="eager"
              figureClassName="h-full w-full"
              wrapperClassName="banner-img mobile w-full"
              className="w-full h-full"
            />
          </header>

          {(welcomeData?.introBody?.length > 0 || welcomeData?.locationBody?.length > 0) && (
            <WelcomeSection
              introImage={welcomeData.introImage}
              locationImage={welcomeData.locationImage}
              introBody={welcomeData.introBody}
              locationBody={welcomeData.locationBody}
              introHeading={welcomeData.introHeading}
              locationHeading={welcomeData.locationHeading}
              showButtons={false}
              eyebrowText="About Ozarkedge"
            />
          )}

          {aboutPageData.body && (
            <section className="our-story-section w-full">
              {(welcomeData?.introBody?.length > 0 || welcomeData?.locationBody?.length > 0) && (
                <hr className="our-story-rule" />
              )}
              <div className="our-story-inner">
                <div className="our-story-head">
                  <p className="our-story-eyebrow">
                    <span className="our-story-circle" aria-hidden="true" />
                    Our Story
                  </p>
                  <h2 id="our-story-heading" className="our-story-heading">
                    {aboutPageData.storyHeading || 'How Ozarkedge came to be'}
                  </h2>
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
