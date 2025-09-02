import cx from 'classnames'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { stegaClean } from '@sanity/client/stega'

import { getUniqueImagesFromDocument } from '../../utilities/imageUtil'
import Heading from '../../components/Heading'
// Dynamically import heavy client components to reduce initial compile size
const LightboxGallery = dynamic(() => import('../../components/LightboxGallery'))
const PortTextWrapper = dynamic(() => import('../../components/PortTextWrapper'))
import ResponsiveImage from '../../components/ResponsiveImage'
import { GET_ABOUT_PAGE_DATA_QUERY } from '../../sanity/lib/queries'
import { sanityFetch } from '../../sanity/lib/sanity.live'

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
          <header className="header-section relative w-full h-full">
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
            <Heading
              className={'content-center text-display '}
              showCircle={false}
              textTypeClass={'text-display'}
              headingClassName={'no-wrap text-white bg-oe-blue-dark-500 px-6 pb-xxs mb-0'}
            >
              About Ozarkedge
            </Heading>
          </header>
          <div className="content-well">
            <Suspense>
              <PortTextWrapper
                className={`relative z-10 mt-2xl`}
                lightboxIdentifier={'about'}
                documentId={docId}
                documentType={docType}
                value={aboutPageData.body}
              />
            </Suspense>
          </div>
        </div>
      )}
    </>
  )
}

export default AboutPage
