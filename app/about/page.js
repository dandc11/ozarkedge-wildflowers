import cx from 'classnames'
import React from 'react'
import { stegaClean } from '@sanity/client/stega'

import { getUniqueImagesFromDocument } from '../../utilities/imageUtil'
import Heading from '../../components/Heading'
import LightboxGallery from '../../components/LightboxGallery'
import PortTextWrapper from '../../components/PortTextWrapper'
import ResponsiveImage from '../../components/ResponsiveImage'
import { GET_ABOUT_PAGE_DATA_QUERY } from '../../sanity/lib/queries'
import { sanityFetch } from '../../sanity/lib/sanity.live'

const AboutPage = async () => {
  /**
   * TODO: 1. PREVIEW - useLiveQuery is a client-side hook, so this will not work in production - need to use Sanity's app router preview kit guide
   */

  const aboutQueryResponse = await sanityFetch({ query: GET_ABOUT_PAGE_DATA_QUERY })
  const aboutPageData = aboutQueryResponse?.data?.[0] ?? null
  const fullImageArray = getUniqueImagesFromDocument(aboutPageData)

  return (
    <>
      <LightboxGallery
        cols={3}
        images={fullImageArray}
        lightboxIdentifier="about"
        slideshow={true}
      />
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
              className={
                'content-center text-display -bottom-8 whitespace-nowrap bp-900:text-right bp-900:px-8 bp-900:py-3 bp-900:-bottom-12'
              }
              showCircle={false}
              absolute
              textTypeClass={'display bp-900:text-3xl'}
              headingClassName={'w-fit text-white bg-oe-blue-dark-500 px-6 pb-xxs mb-0'}
            >
              About Ozarkedge
            </Heading>
          </header>
          <PortTextWrapper
            className={`relative z-10 mt-2xl`}
            lightboxIdentifier={'about'}
            value={aboutPageData.body}
          />
        </div>
      )}
    </>
  )
}

export default AboutPage
