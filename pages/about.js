import cx from 'classnames'
import React, { useState, useEffect, useContext } from 'react'
import Heading from 'components/Heading'
import PortTextWrapper from 'components/PortTextWrapper'
import ResponsiveImage from 'components/ResponsiveImage'
import { useLiveQuery } from 'next-sanity/preview'
import { GET_ABOUT_PAGE_DATA_QUERY } from '../lib/queries'
import { readToken } from '../lib/sanity.api'
import { getClient } from '../lib/sanity.client'
import LightboxGallery from 'components/LightboxGallery'
import { getUniqueImagesFromDocument } from 'utilities/imageUtil'
import { NavButtonColorContext } from 'contexts/NavButtonColorContext'

const AboutPage = (props) => {
  const { pageProps = null } = props
  const [pageData] = useLiveQuery(pageProps, GET_ABOUT_PAGE_DATA_QUERY)
  console.log('pageData', pageData)

  const {
    _id: id,
    body: bodyPortableText,
    menuButtonColor = 'light',
    mainImage,
    mobileImage,
  } = pageData[0]

  const [navButtonColor, setNavButtonColor] = React.useContext(NavButtonColorContext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { setNavButtonColor(menuButtonColor)}, [menuButtonColor])

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [startingSlideIndex, setStartingSlideIndex] = useState(0)
  const fullImageArray = getUniqueImagesFromDocument(pageData[0])
  const toggleLightbox = (key) => {
    // toggle lightbox, set starting slide index if opening
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
    <>
      {pageData &&
        pageData.map(() => (
          <div
            className={`about-content overflow-hidden flex flex-col relative`}
            key={id}
          >
            <Heading
              className={'content-center px-10 pt-20 mb-0 bp-900:pl-20'}
              showCircle={false}
              headingClassName={''}
            >
              About Ozarkedge
            </Heading>
            <ResponsiveImage
              image={mainImage}
              alt={mainImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              loading="eager"
              figureClassName="h-full w-full"
              wrapperClassName="hidden w-full bg-oe-green-yellow-200 bp-900:block"
              className="rounded-none "
            />
            <ResponsiveImage
              image={mobileImage}
              alt={mobileImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              loading="eager"
              figureClassName="h-full w-full"
              wrapperClassName="w-full  bg-oe-green-yellow-200 bp-900:hidden"
              className="rounded-none "
            />
            <PortTextWrapper
              className={`relative z-10 order-2 px-8 pb-6 max-w-[30rem] text-black`}
              lightboxCallback={toggleLightbox}
              value={bodyPortableText}
            />
            <LightboxGallery
              className={`px-4`}
              cols={3}
              lightboxImgClass={`h-[80vh]`}
              images={fullImageArray}
              lightboxIdentifier="aboutPage"
              onCloseCallback={closeLightbox}
              open={isLightboxOpen}
              slideshow={true}
              showImageGrid={false}
              startingSlideIndex={startingSlideIndex}
            />
          </div>
        ))}
    </>
  )
}

export async function getStaticProps(context) {
  const client = getClient(
    context?.draftMode ? { token: readToken } : undefined,
  )
  const pageProps = await client.fetch(GET_ABOUT_PAGE_DATA_QUERY)
  return {
    props: {
      pageProps,
    },
  }
}

export default AboutPage
