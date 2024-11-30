import cx from 'classnames'
import React from 'react'
import { groq } from 'next-sanity'

import TeaserSlider from '../components/TeaserSlider'
import Button from '../components/Button'
import ContextUpdater from '../components/ContextUpdater'
import ResponsiveImage from '../components/ResponsiveImage'
import {
  getCurrentMonthName,
  titleCase,
  getCurrentSeason,
} from '../utilities/helperUtil'
import { CURRENT_MONTH_NUMBER } from '../utilities/constants'
import {
  GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
  GET_CURRENT_SEASON_DATA_QUERY,
  GET_LANDING_PAGE_DATA_QUERY,
} from '../app/lib/queries'
import { client } from '../app/lib/sanity.client'

/**
 * @param {object} pageProps - props for the page
 * @param {object} bloomingProps - props for the blooming now component
 * @param {object} seasonProps - props for the seasons component
 * @returns {JSX.Element} - the page
 * @category Pages
 **/
const HomePage = async () => {
  /**
   * TODO: 1. PREVIEW - useLiveQuery is a client-side hook, so this will not work in production - need to use Sanity's app router preview kit guide
   * TODO: 2. LIGHTBOX - need to set all Lightbox context properties when this page is routed to. They should be fetched the first time and thereafter cached.
   * TODO: 3. MENU BUTTON COLOR -need to set all nav button color context when this page is routed to. Should this be fetched the first time and thereafter cached?
   */
  const seasonData =
    await client.fetch(groq`*[!(_id in path('drafts.**')) && _type == "season" && ${CURRENT_MONTH_NUMBER}  in monthNumbers]
  {
    metaDescription,
  }`)
  const pageData = await client.fetch(GET_LANDING_PAGE_DATA_QUERY)

  const bloomingPlantImages = await client.fetch(
    GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
  )

  const {
    id,
    titleText,
    subtitleText,
    mainImage: bgImage,
    menuButtonColor = 'light',
    mobileImage: bgImageSmall,
    buttonOne,
    buttonTwo,
  } = pageData[0]

  const teaserBodyText = seasonData[0]?.metaDescription
  const currentSeason = getCurrentSeason()?.SEASON_NAME
  const thisMonth = getCurrentMonthName()
  const BloomingHeadingText = ({ thisMonth }) => (
    <span className="">BLOOMING in {titleCase(thisMonth)}</span>
  )
  return (
    <>
      <ContextUpdater navButtonColor={menuButtonColor} />

      {pageData &&
        pageData.map(() => (
          <div
            className={`homepage-content w-full overflow-hidden p-0`}
            key={id}
          >
            <section className="atf relative flex flex-col justify-between">
              <ResponsiveImage
                image={bgImage}
                alt={bgImage?.alt || 'A picture of the Ozarkedge property'}
                disableHover
                disablePointer
                loading="eager"
                figureClassName="h-full w-full"
                wrapperClassName="absolute bg-img w-full"
                className="w-full h-full"
              />
              <ResponsiveImage
                image={bgImageSmall}
                alt={bgImageSmall?.alt || 'A picture of the Ozarkedge property'}
                disableHover
                disablePointer
                loading="eager"
                figureClassName="h-full w-full"
                wrapperClassName="absolute bg-img mobile w-full"
                className="w-full h-full"
              />
              <div className={`homepage-title self-start text-center m-bk-9`}>
                <h1 className={`title text-dynamic-title font-display`}>
                  {titleText}
                </h1>
                <p className={`subtitle fs-md `}>{subtitleText}</p>
              </div>
              <div className={`homepage-cta `}>
                <div className={`cta-buttons flex flex-col`}>
                  {buttonOne && (
                    <Button
                      className={`btn-primary bp-900:mb-6`}
                      slug={buttonOne.slug}
                      linkDocType={buttonOne.docType}
                    ></Button>
                  )}
                  {buttonTwo && (
                    <Button
                      className={`btn-secondary bp-900:ml-8`}
                      slug={buttonTwo.slug}
                      linkDocType={buttonTwo.docType}
                    >
                      Explore native wildflowers
                    </Button>
                  )}
                </div>
              </div>
            </section>
            <div
              className={`btf w-full bg-yellow-100 bp-1100:bg-[#f1f0caeb]`}
              tag={'section'}
            >
              <TeaserSlider
                id={`bloomingNow`}
                images={bloomingPlantImages}
                headingChildren={<BloomingHeadingText thisMonth={thisMonth} />}
                headingId={`bloomingHeading`}
                headingClassName={`blooming-heading`}
                bodyText={teaserBodyText}
                buttonLinkSlug={`${currentSeason}`}
                buttonLinkDocType={'season'}
                buttonLinkText={`More about ${currentSeason} flowers`}
                lightboxIdentifier={`bloomingNow`}
                className={`blooming-now`}
              />
            </div>
          </div>
        ))}
    </>
  )
}

export default HomePage
