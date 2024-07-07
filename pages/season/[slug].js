import React, { useState, useContext } from 'react'
import { getClient } from '../../lib/sanity.client'
import { readToken } from '../../lib/sanity.api'
import { useLiveQuery } from 'next-sanity/preview'
import {
  GET_ALL_SEASON_PATHS_QUERY,
  GET_SEASON_PAGE_DATA_QUERY,
} from '../../lib/queries'
import cx from 'classnames'
import { NavButtonColorContext } from 'contexts/NavButtonColorContext'
import LightboxGallery from '../../components/LightboxGallery'
import PortTextWrapper from '../../components/PortTextWrapper'
import ResponsiveImage from '../../components/ResponsiveImage'
import HeadingDisplay from '../../components/HeadingDisplay'
import { getUniqueImagesFromDocument } from 'utilities/imageUtil'


const SeasonPage = (props) => {
  const { pageProps = null } = props
  const [seasonPageData] = useLiveQuery(pageProps, GET_ALL_SEASON_PATHS_QUERY)
  console.log('seasonPageData', seasonPageData)
  const {
    seasonName = 'spring',
    description = [],
    mainImage,
    mobileImage,
    monthNumbers = [],
    menuButtonColor = 'light',
    teaserSectionText = '',
} = seasonPageData

  const [navButtonColor, setNavButtonColor] = React.useContext(
    NavButtonColorContext,
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    setNavButtonColor(menuButtonColor)
  }, [menuButtonColor])

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [startingSlideIndex, setStartingSlideIndex] = useState(0)
  const fullImageArray = getUniqueImagesFromDocument(seasonPageData)
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
              alt={mainImage?.alt || `A picture of ${seasonName} Ozarkedge `}
              disableHover
              disablePointer
              loading="eager"
              showCaption={false}
              figureClassName="h-full w-full"
              wrapperClassName="season-header-img relative hidden w-full bg-oe-green-yellow-200 bp-900:block bp-900:h-[70vh] "
              className="object-cover object-[50%_10%] rounded-none w-full h-full"
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
              loading="eager"
              showCaption={false}
              figureClassName="h-full w-full"
              wrapperClassName="season-header-img relative w-full bg-oe-green-yellow-200 bp-900:hidden"
              className="object-cover rounded-none bp-1200:object-[50%_35%] "
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
            {/* {teaserSectionText && (
            <TeaserSection
              id={`plantListTeaser`}
              images={teaserImages}
              // headingChildren={<BloomingHeadingText thisMonth={thisMonth} />}
              headingId={`bloomingHeading`}
              headingClassName={`blooming-heading`}
              bodyText={teaserSectionText}
            />
          )} */}
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
  const client = getClient()
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
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const { slug = '' } = params
  const pageProps = await client.fetch(GET_SEASON_PAGE_DATA_QUERY, { slug })
  return {
    props: {
      pageProps,
    },
  }
}

export default SeasonPage
