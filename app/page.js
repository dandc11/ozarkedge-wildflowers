import React, { Suspense } from 'react'
import { draftMode } from 'next/headers'
import dynamic from 'next/dynamic'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'

const TeaserSlider = dynamic(() => import('../components/TeaserSlider'))
import ResponsiveImage from '../components/ResponsiveImage'
import WelcomeSection from '../components/WelcomeSection'
import {
  getCurrentMonthName,
  titleCase,
  getCurrentSeason,
  displaySeasonName,
} from '../utilities/helperUtil'
import { IMG_SIZES } from '../utilities/constants'
import {
  GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
  GET_CURRENT_SEASON_DATA_QUERY,
  GET_LANDING_PAGE_DATA_QUERY,
  GET_WELCOME_SECTION_QUERY,
} from '../sanity/lib/queries'
import { sanityFetch } from '../sanity/lib/sanity.live'
import { urlForImage } from '../sanity/lib/sanity.image'

/**
 * Generates metadata for the home page using landing page data from Sanity.
 */
export async function generateMetadata() {
  const { data } = await sanityFetch({
    query: GET_LANDING_PAGE_DATA_QUERY,
    stega: false,
  })
  const landingPageData = data?.[0] ?? null
  const title = stegaClean(landingPageData?.titleText) || 'Ozarkedge Wildflowers'
  const description = stegaClean(landingPageData?.metaDescription) || undefined
  const ogImage = landingPageData?.mainImage
    ? urlForImage(landingPageData.mainImage, { width: 1200, height: 630 })?.url()
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

/**
 * @param {object} pageProps - props for the page
 * @param {object} bloomingProps - props for the blooming now component
 * @param {object} seasonProps - props for the seasons component
 * @returns {JSX.Element} - the page
 * @category Pages
 **/
export default async function HomePage() {
  const { isEnabled: isDraftMode } = await draftMode()
  // Current season data (centralized query)
  const seasonQueryResponse = await sanityFetch({
    query: GET_CURRENT_SEASON_DATA_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  const seasonData = seasonQueryResponse?.data?.[0] ?? null

  const bloomingQueryResponse = await sanityFetch({
    query: GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  const bloomingPlantArray = bloomingQueryResponse?.data ?? []

  const landingPageQueryResponse = await sanityFetch({
    query: GET_LANDING_PAGE_DATA_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  const landingPageData = landingPageQueryResponse?.data?.[0] ?? null

  const welcomeQueryResponse = await sanityFetch({
    query: GET_WELCOME_SECTION_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  const welcomeData = welcomeQueryResponse?.data ?? null
  const menuButtonColor = stegaClean(landingPageData?.menuButtonColor) || 'light'

  const teaserBodyText = seasonData?.metaDescription
  const seasonDefaultImage = seasonData?.mainImage
  const currentSeason = getCurrentSeason()?.SEASON_NAME
  const teaserButtonLinkText = `Visit our ${displaySeasonName(currentSeason)} page`
  const thisMonth = getCurrentMonthName()
  const BloomingHeadingText = ({ thisMonth }) => (
    <span className="blooming-title fw-400">
      {currentSeason === 'winter'
        ? `${titleCase(thisMonth)}`
        : `Blooming in ${titleCase(thisMonth)}`}
    </span>
  )
  return (
    <>
      {landingPageData && (
        <div
          className={`homepage-content w-full overflow-hidden p-0 nav-${menuButtonColor}`}
          key={landingPageData._id}
        >
          <section className="atf relative flex flex-col justify-between align-center">
            <ResponsiveImage
              alt={landingPageData.mainImage?.alt || 'A picture of the Ozarkedge property'}
              className="w-full h-full"
              disableHover
              disablePointer
              priority
              fetchPriority="high"
              figureClassName="h-full w-full"
              image={landingPageData.mainImage}
              quality={85}
              sizes={IMG_SIZES.HERO_DESKTOP_SIZES}
              wrapperClassName="absolute bg-img w-full"
            />
            <ResponsiveImage
              image={landingPageData.mobileImage ? landingPageData.mobileImage : landingPageData.mainImage}
              alt={landingPageData.mobileImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              disablePointer
              fetchPriority="high"
              priority
              sizes={IMG_SIZES.HERO_MOBILE_SIZES}
              figureClassName="h-full w-full"
              wrapperClassName="absolute bg-img mobile w-full"
              className="w-full h-full"
            />
            <div className={`homepage-title text-center p-in-md`}>
              <h1 className={`title text-dynamic-title text-display`}>
                {landingPageData.titleText}
              </h1>
              <p className={`subtitle fs-md `}>{landingPageData.subtitleText}</p>
            </div>
            <div className={`homepage-cta `}>
              <a className="welcome-btn" href="#bloomingNow">
                See what&apos;s blooming in {titleCase(thisMonth)}{' '}
                <span className="welcome-btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </section>
          <div className={`btf w-full`} tag={'section'}>
            <Suspense>
              <TeaserSlider
                bodyText={teaserBodyText}
                buttonLinkSlug={`${currentSeason}`}
                buttonLinkDocType={'season'}
                buttonLinkText={teaserButtonLinkText}
                className={`blooming-now`}
                defaultImage={seasonDefaultImage}
                headingChildren={<BloomingHeadingText thisMonth={thisMonth} />}
                headingClassName={`blooming-heading`}
                headingId={`bloomingHeading`}
                id={`bloomingNow`}
                images={bloomingPlantArray}
                lightboxIdentifier={`bloomingNow`}
              />
            </Suspense>
          </div>
          {(welcomeData?.introBody?.length > 0 || welcomeData?.locationBody?.length > 0) && (
            <WelcomeSection
              introImage={welcomeData.introImage}
              locationImage={welcomeData.locationImage}
              introBody={welcomeData.introBody}
              locationBody={welcomeData.locationBody}
              introHeading={welcomeData.introHeading}
              locationHeading={welcomeData.locationHeading}
              showButtons={true}
            />
          )}
        </div>
      )}
    </>
  )
}
