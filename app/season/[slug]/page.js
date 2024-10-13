'use client'
import React, { useState, useContext } from 'react'
import { useLiveQuery } from 'next-sanity/preview'
import cx from 'classnames'

import { getUniqueImagesFromDocument } from '../../../utilities/imageUtil'
import { NavContext } from '../../../contexts/NavContext'
import { client } from '../../lib/sanity.client'
import { readToken } from '../../lib/sanity.api'
import {
  GET_ALL_SEASON_PATHS_QUERY,
  GET_SEASON_PAGE_DATA_QUERY,
} from '../../lib/queries'
import LightboxGallery from '../../../components/LightboxGallery'
import PortTextWrapper from '../../../components/PortTextWrapper'
import ResponsiveImage from '../../../components/ResponsiveImage'
import HeadingDisplay from '../../../components/HeadingDisplay'



const SeasonPage = (props) => {
  const { pageProps = null } = props
  const [seasonPageData] = useLiveQuery(pageProps, GET_ALL_SEASON_PATHS_QUERY)
  // console.log('seasonPageData', seasonPageData)
  const {
    seasonName = 'spring',
    description = [],
    mainImage,
    mobileImage,
    monthNumbers = [],
    menuButtonColor = 'light',
    teaserSectionText = '',
} = {...seasonPageData}

  const [navButtonColor, setNavButtonColor] = React.useContext(
    NavContext,
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    setNavButtonColor(menuButtonColor)
  }, [menuButtonColor])

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [startingSlideIndex, setStartingSlideIndex] = useState(0)
  const fullImageArray = getUniqueImagesFromDocument(seasonPageData)
  const wrapperClassName = cx(`banner-img relative w-full bg-oe-green-yellow-200 bp-900:block bp-900:h-[85vh]`)
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
      {seasonPageData && (
        <div
          className={`season-page-content ${seasonName}`}
        >
          <section id={'sesaonHeader'} className="season-header relative w-full h-full">
            <ResponsiveImage
              image={mainImage}
              alt={mainImage?.alt || `${seasonName} at Ozarkedge `}
              disableHover
              disablePointer
              loading="eager"
              showCaption={false}
              figureClassName="h-full w-full"
              wrapperClassName={wrapperClassName}
              className="object-cover rounded-none w-full h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <polygon points="100 0 100 10 0 10" />
              </svg>
            </ResponsiveImage>
            <ResponsiveImage
              image={mobileImage ? mobileImage : mainImage}
              alt={mobileImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              disablePointer
              loading="eager"
              showCaption={false}
              figureClassName="h-full w-full"
              wrapperClassName="banner-img mobile relative w-full bg-oe-green-yellow-200 bp-900:hidden"
              className="object-cover rounded-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <polygon points="100 7 100 10 0 10" />
              </svg>
            </ResponsiveImage>
            <HeadingDisplay
              className={cx(`text-right`)}
              absolute
              headingClassName={'display'}
            >
              {seasonName}
            </HeadingDisplay>
          </section>
          <section id={'seasonBody'} className="season-body">
            <PortTextWrapper
              className={`relative z-10 text-black`}
              lightboxCallback={toggleLightbox}
              value={description}
            />
            <LightboxGallery
              className={`px-4`}
              cols={3}
              lightboxImgClass={`h-[80vh]`}
              images={fullImageArray}
              lightboxIdentifier="seasonPage"
              onCloseCallback={closeLightbox}
              open={isLightboxOpen}
              slideshow={true}
              showImageGrid={false}
              startingSlideIndex={startingSlideIndex}
            />
          </section>
        </div>
      )}
    </>
  )
}

export async function getStaticPaths() {
  const seasonPagePaths = await client.fetch(GET_ALL_SEASON_PATHS_QUERY)
  const paths = seasonPagePaths.map((slug) => ({
    params: { slug },
  }))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const { draftMode = false, params = {} } = context
  const { slug = '' } = params
  const pageProps = await client.fetch(GET_SEASON_PAGE_DATA_QUERY, { slug })
  return {
    props: {
      pageProps,
    },
  }
}

export default SeasonPage
