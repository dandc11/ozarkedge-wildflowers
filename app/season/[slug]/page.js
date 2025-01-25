import React from 'react'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'

import LightboxGallery from '../../../components/LightboxGallery'
import PortTextWrapper from '../../../components/PortTextWrapper'
import ResponsiveImage from '../../../components/ResponsiveImage'
import HeadingDisplay from '../../../components/HeadingDisplay'
import FeatureSection from '../../../components/FeatureSection'
import { getUniqueImagesFromDocument } from '../../../utilities/imageUtil'
import { destructureFeature } from '../../../utilities/helperUtil'
import { GET_ALL_SEASON_PATHS_QUERY, GET_SEASON_PAGE_DATA_QUERY } from '../../../sanity/lib/queries'
import { client } from '../../../sanity/lib/sanity.client'
import { sanityFetch } from '../../../sanity/lib/sanity.live'

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: GET_ALL_SEASON_PATHS_QUERY,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

const SeasonPage = async (props) => {
  /** TODO: 2. TEASER - retrieve FeatureSection data for teaser section - add to query, dereference in query, and pass to FeatureSection component (replacing TeaserSection)
   */
  const params = await props.params
  const [{ data: pageData }] = await Promise.all([
    sanityFetch({ query: GET_SEASON_PAGE_DATA_QUERY, params }),
  ])

  if (!pageData?._id) {
    return <div className="py-40">Loading...</div>
  }

  const {
    seasonName = 'spring',
    description = [],
    feature,
    slug,
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
          <div className={`season-page ${stegaClean(seasonName)}`}>
            <section id={'seasonHeader'} className="season-header relative w-full h-full">
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

export default SeasonPage
