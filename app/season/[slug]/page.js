import React from 'react'
import cx from 'classnames'

import LightboxGallery from '../../../components/LightboxGallery'
import PortTextWrapper from '../../../components/PortTextWrapper'
import ResponsiveImage from '../../../components/ResponsiveImage'
import HeadingDisplay from '../../../components/HeadingDisplay'
import FeatureSection from '../../../components/FeatureSection'
import ContextUpdater from '../../../components/ContextUpdater'
import { getUniqueImagesFromDocument } from '../../../utilities/imageUtil'
import { destructureFeature } from '../../../utilities/helperUtil'
import {
  GET_ALL_SEASON_PATHS_QUERY,
  GET_SEASON_PAGE_DATA_QUERY,
} from '../../lib/queries'
import { client } from '../../lib/sanity.client'

const SeasonPage = async ({ params }) => {
  /**
   * TODO: 1. PREVIEW - useLiveQuery is a client-side hook, so this will not work in production - need to use Sanity's app router preview kit guide
   * TODO: 2. TEASER - retrieve FeatureSection data for teaser section - add to query, dereference in query, and pass to FeatureSection component (replacing TeaserSection)
   */
  const { slug } = params
  const pageData = await client.fetch(GET_SEASON_PAGE_DATA_QUERY, { slug })

  const {
    seasonName = 'spring',
    description = [],
    feature,
    mainImage,
    mobileImage,
    monthNumbers = [],
    menuButtonColor = 'light',
    teaserSectionText = '',
  } = { ...pageData }

  const fullImageArray = getUniqueImagesFromDocument(pageData)
  const wrapperClassName = cx(`banner-img relative w-full`)

  return (
    <>
      {pageData && (
        <>
          <ContextUpdater navButtonColor={menuButtonColor} />
          <div className={`season-page ${seasonName}`}>
            <section
              id={'sesaonHeader'}
              className="season-header relative w-full h-full"
            >
              <ResponsiveImage
                image={mainImage}
                alt={mainImage?.alt || `${seasonName} at Ozarkedge `}
                disableHover
                disablePointer
                loading="eager"
                showCaption={false}
                figureClassName="h-full w-full"
                wrapperClassName={wrapperClassName}
                className="rounded-none w-full h-full"
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
                wrapperClassName={cx(wrapperClassName, `mobile`)}
                className="rounded-none"
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
                headingClassName={'font-display'}
              >
                {seasonName}
              </HeadingDisplay>
            </section>
            <section id={'seasonBody'} className="season-body content-well">
              <PortTextWrapper
                className={`relative`}
                lightboxIdentifier="seasonPage"
                value={description}
              />
              {feature && <FeatureSection feature={feature} />}
            </section>
            <LightboxGallery
              cols={3}
              lightboxImgClass={`h-[80vh]`}
              images={fullImageArray}
              lightboxIdentifier="seasonPage"
            />
          </div>
        </>
      )}
    </>
  )
}

export async function generateStaticParams() {
  const seasonPagePaths = await client.fetch(GET_ALL_SEASON_PATHS_QUERY)
  return seasonPagePaths.map((slug) => ({
    slug,
  }))
}

export default SeasonPage
