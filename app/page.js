import cx from 'classnames'
import React from 'react'
import { stegaClean } from '@sanity/client/stega'

import TeaserSlider from '../components/TeaserSlider'
import Button from '../components/Button'
import ResponsiveImage from '../components/ResponsiveImage'
import { getCurrentMonthName, titleCase, getCurrentSeason } from '../utilities/helperUtil'
import { IMG_SIZES } from '../utilities/constants'
import {
  GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
  GET_CURRENT_SEASON_DATA_QUERY,
  GET_LANDING_PAGE_DATA_QUERY,
} from '../sanity/lib/queries'
import { sanityFetch } from '../sanity/lib/sanity.live'

/**
 * @param {object} pageProps - props for the page
 * @param {object} bloomingProps - props for the blooming now component
 * @param {object} seasonProps - props for the seasons component
 * @returns {JSX.Element} - the page
 * @category Pages
 **/
export default async function HomePage() {
  // Current season data (centralized query)
  const seasonQueryResponse = await sanityFetch({
    query: GET_CURRENT_SEASON_DATA_QUERY,
  })
  const seasonData = seasonQueryResponse?.data?.[0] ?? null

  const bloomingQueryResponse = await sanityFetch({
    query: GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
  })
  const bloomingPlantArray = bloomingQueryResponse?.data ?? []

  const landingPageQueryResponse = await sanityFetch({ query: GET_LANDING_PAGE_DATA_QUERY })
  const landingPageData = landingPageQueryResponse?.data?.[0] ?? null
  const menuButtonColor = stegaClean(landingPageData?.menuButtonColor) || 'light'

  const teaserBodyText = seasonData?.metaDescription
  const seasonDefaultImage = seasonData?.mainImage
  const currentSeason = getCurrentSeason()?.SEASON_NAME
  const teaserButtonLinkText = `Visit our ${currentSeason} page`
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
          key={landingPageData.id}
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
              image={landingPageData.mobileImage}
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
              <div className={`cta-buttons flex flex-col`}>
                {landingPageData.buttonOne && (
                  <Button
                    className={`btn-1 bp-900:mb-xl`}
                    slug={landingPageData.buttonOne?.slug}
                    linkDocType={landingPageData.buttonOne?.docType}
                  ></Button>
                )}
                {landingPageData.buttonTwo && (
                  <Button
                    className={`btn-5 bp-900:ml-8`}
                    slug={landingPageData.buttonTwo.slug}
                    linkDocType={landingPageData.buttonTwo.docType}
                  >
                    Explore native wildflowers
                  </Button>
                )}
              </div>
            </div>
          </section>
          <div data-season={currentSeason} className={`btf w-full`} tag={'section'}>
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
          </div>
        </div>
      )}
    </>
  )
}
