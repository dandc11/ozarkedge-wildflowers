import React from 'react'
import { draftMode } from 'next/headers'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'
import { notFound } from 'next/navigation'

import LightboxGallery from '../../../components/LightboxGallery'
import PortTextWrapper from '../../../components/PortTextWrapper'
import ResponsiveImage from '../../../components/ResponsiveImage'
import HeadingDisplay from '../../../components/HeadingDisplay'
import FeatureSection from '../../../components/FeatureSection'
import { getUniqueImagesFromDocument } from '../../../utilities/imageUtil'
import { GET_ALL_SEASON_PATHS_QUERY, GET_SEASON_PAGE_DATA_QUERY } from '../../../sanity/lib/queries'
import { IMG_SIZES } from '../../../utilities/constants'
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
  // Next.js expects an array of params objects, e.g., [{ slug: 'spring' }]
  // Our query returns an array of strings (slugs), so map them accordingly.
  const slugs = Array.isArray(data) ? data : []
  return slugs
    .filter(Boolean)
    .map((slug) => (typeof slug === 'string' ? { slug } : { slug: slug?.slug }))
    .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
}

const SeasonPage = async (props) => {
  /** TODO: 2. TEASER - retrieve FeatureSection data for teaser section - add to query, dereference in query, and pass to FeatureSection component (replacing TeaserSection)
   */
  const { isEnabled: isDraftMode } = await draftMode()
  const params = await props.params
  const [{ data: pageData }] = await Promise.all([
    sanityFetch({
      query: GET_SEASON_PAGE_DATA_QUERY,
      params,
      perspective: isDraftMode ? 'previewDrafts' : 'published',
      stega: isDraftMode,
    }),
  ])

  if (!pageData?._id) {
    notFound()
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
  const docId = pageData._id
  const docType = 'seasonPage'

  return (
    <>
      {pageData && (
        <>
          <div
            className={`season-page ${stegaClean(seasonName)} nav-${stegaClean(menuButtonColor)}`}
          >
            <section id={'seasonHeader'} className="season-header relative w-full h-full">
              <ResponsiveImage
                alt={mainImage?.alt || `${seasonName} at Ozarkedge `}
                className="rounded-none w-full h-full"
                disableHover
                disablePointer
                fetchPriority="high"
                figureClassName="h-full w-full"
                image={mainImage}
                priority
                showCaption={false}
                quality={85}
                sizes={IMG_SIZES.HERO_DESKTOP_SIZES}
                wrapperClassName={wrapperClassName}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  className="header-border-svg"
                >
                  <polygon points="100 0 100 10 0 10" />
                </svg>
              </ResponsiveImage>
              <ResponsiveImage
                alt={mobileImage?.alt || 'A picture of the Ozarkedge property'}
                className="rounded-none"
                disableHover
                disablePointer
                fetchPriority="high"
                figureClassName="h-full w-full"
                image={mobileImage ? mobileImage : mainImage}
                priority
                showCaption={false}
                sizes={IMG_SIZES.HERO_MOBILE_SIZES}
                wrapperClassName={cx(wrapperClassName, `mobile`)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  className="header-border-svg"
                >
                  <polygon points="100 7 100 10 0 10" />
                </svg>
              </ResponsiveImage>
              <HeadingDisplay
                className={cx(`text-right`)}
                absolute
                headingClassName={'text-display'}
              >
                {seasonName}
              </HeadingDisplay>
            </section>
            <section id={'seasonBody'} className="season-body content-well">
              <PortTextWrapper
                className={`relative`}
                lightboxIdentifier="seasonPage"
                value={description}
                documentId={docId}
                documentType={docType}
              />
              {feature && <FeatureSection feature={feature} />}
            </section>
            <LightboxGallery
              cols={3}
              stuff={pageData}
              lightboxImgClass={`lightbox-img`}
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
