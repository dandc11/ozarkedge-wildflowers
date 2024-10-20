
import cx from 'classnames'
import React from 'react'
// import { useLiveQuery } from 'next-sanity/preview'

import { getUniqueImagesFromDocument } from '../../utilities/imageUtil'
import Heading from '../../components/Heading'
import LightboxGallery from '../../components/LightboxGallery'
import PortTextWrapper from '../../components/PortTextWrapper'
import ResponsiveImage from '../../components/ResponsiveImage'
import { GET_ABOUT_PAGE_DATA_QUERY } from '../lib/queries'
import { readToken } from '../lib/sanity.api'
import { client } from '../lib/sanity.client'


const AboutPage = async () => {
  /**
   * TODO: 1. PREVIEW - useLiveQuery is a client-side hook, so this will not work in production - need to use getServerSideProps or some other data fetching and prview mode handling
   * TODO: 2. LIGHTBOX - useState for LightboxGallery will not work in a server component - this will need to be refactored 
   * TODO: 3. MENU BUTTON COLOR -The menu button color can no longer be set by the image used on the page - this will need to be refactored
  */ 
 // const [pageData] = useLiveQuery(pageProps, GET_ABOUT_PAGE_DATA_QUERY)

  const pageData = await client.fetch(GET_ABOUT_PAGE_DATA_QUERY);

  const {
    _id: id,
    body: bodyPortableText,
    menuButtonColor = 'light',
    mainImage,
    mobileImage,
  } = pageData[0]

  // const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  // const [startingSlideIndex, setStartingSlideIndex] = useState(0)
  const fullImageArray = getUniqueImagesFromDocument(pageData[0])
  // const toggleLightbox = (key) => {
  //   // toggle lightbox, set starting slide index if opening
  //   if (key) {
  //     const index = fullImageArray.findIndex((e) => e.asset._ref === key)
  //     setStartingSlideIndex(index)
  //   }
  //   setIsLightboxOpen(!isLightboxOpen)
  // }
  // const closeLightbox = () => {
  //   setIsLightboxOpen(false)
  // }
  return (
    <>
      {pageData &&
        pageData.map(() => (
            <div
              className={`about-content overflow-hidden flex flex-col items-center relative`}
              key={id}
            >
              <section className="header-section relative w-full h-full">
                <ResponsiveImage
                  image={mainImage}
                  alt={mainImage?.alt || 'A picture of the Ozarkedge property'}
                  disableHover
                  disablePointer
                  loading="eager"
                  figureClassName="h-full w-full"
                  wrapperClassName="banner-img w-full bg-oe-green-yellow-200"
                  className=" object-[50%_10%] w-full h-full"
                />
                <ResponsiveImage
                  image={mobileImage}
                  alt={
                    mobileImage?.alt || 'A picture of the Ozarkedge property'
                  }
                  disableHover
                  disablePointer
                  loading="eager"
                  figureClassName="h-full w-full"
                  wrapperClassName="banner-img mobile w-full bg-oe-green-yellow-200"
                  className=" bp-1200:object-[50%_35%] "
                />
                <Heading
                  className={
                    'content-center text-display -bottom-8 whitespace-nowrap bp-900:text-right bp-900:px-8 bp-900:py-3 bp-900:-bottom-12'
                  }
                  showCircle={false}
                  absolute
                  textTypeClass={'display bp-900:text-3xl'}
                  headingClassName={
                    'w-fit text-white bg-oe-blue-dark-500 shadow-md px-6 pb-1 mb-0'
                  }
                >
                  About Ozarkedge
                </Heading>
              </section>
              <PortTextWrapper
                className={`relative z-10 order-2 mt-7`}
                // lightboxCallback={toggleLightbox}
                value={bodyPortableText}
              />
              {/* <LightboxGallery
                className={`px-4`}
                cols={3}
                lightboxImgClass={`h-[80vh]`}
                images={fullImageArray}
                lightboxIdentifier="aboutPage"
                onCloseCallback={closeLightbox ? closeLightbox : () => {}}
                slideshow={true}
                showImageGrid={false}
                startingSlideIndex={startingSlideIndex}
              /> */}
            </div>
        ))}
    </>
  )
}

export default AboutPage
