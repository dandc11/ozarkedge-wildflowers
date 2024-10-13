'use client'
import cx from 'classnames'
import { useLiveQuery } from 'next-sanity/preview'
import React, { useContext } from 'react'
import { groq } from 'next-sanity'

import { NavContext } from '../contexts/NavContext'
import TeaserSlider from '../components/TeaserSlider'
import Button from '../components/Button'
import {
  getCurrentMonthName,
  titleCase,
  getCurrentSeason,
} from '../utilities/helperUtil'
import {
  CURRENT_MONTH_NUMBER,
  DOCTYPE_PATH_PREFIXES,
} from '../utilities/constants'
import {
  GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
  GET_CURRENT_SEASON_DATA_QUERY,
  GET_LANDING_PAGE_DATA_QUERY,
} from '../app/lib/queries'
import { readToken } from '../app/lib/sanity.api'
import { client } from '../app/lib/sanity.client'
import { buildBackgroundStyleObject } from '../utilities/imageUtil'


/**
 * @param {object} pageProps - props for the page
 * @param {object} bloomingProps - props for the blooming now component
 * @param {object} seasonProps - props for the seasons component
 * @returns {JSX.Element} - the page
 * @category Pages
 **/
export default function HomePage(props) {
  const { pageProps = null, bloomingProps = null, seasonProps = null } = props
  const [pageData] = useLiveQuery(pageProps, GET_LANDING_PAGE_DATA_QUERY)
  const [bloomingPlantImages] = useLiveQuery(
    bloomingProps,
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
  const {navButtonColor, setNavButtonColor} = React.useContext(
    NavContext,
  )

  const [seasonData] = useLiveQuery(seasonProps, GET_CURRENT_SEASON_DATA_QUERY)
  const teaserBodyText = seasonData[0]?.metaDescription
  const currentSeason = getCurrentSeason()?.SEASON_NAME
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    setNavButtonColor(menuButtonColor)
  }, [menuButtonColor])
  const aboveFoldBackground = { bgImage, bgImageSmall }
  const bgStyle = buildBackgroundStyleObject(aboveFoldBackground)
  const thisMonth = getCurrentMonthName()
  const BloomingHeadingText = ({ thisMonth }) => (
    <span className="">BLOOMING in {titleCase(thisMonth)}</span>
  )
  return (
    <>
      <div>
        {pageData &&
          pageData.map(() => (
            <div
              className={`homepage-content w-full h-auto overflow-hidden flex flex-col relative p-0`}
              key={id}
            >
              <div
                className={`-z-10 w-full h-[100svh] bg-center bg-cover bp-900:absolute bp-900:top-0 bp-900:left-0 bp-900:bg-cover bp-900:bg-scroll bp-1100:fixed `}
                id={`landingImageContainer`}
                style={bgStyle}
              ></div>
              <div className={`above-fold bp-900:h-[100svh]`}>
                <div
                  className={`homepage-info-section absolute px-4 pt-16 pb-4 top-0 flex flex-col bg-transparent justify-between w-full h-[100svh] bp-900:justify-start bp-1200:pr-6`}
                >
                  <div
                    className={`homepage-title self-center text-center bp-900:self-end bp-900:text-right`}
                  >
                    <h1
                      className={`title text-dynamic-title font-display pb-1 font-bold leading-none bp-600:leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-oe-red-500 to-oe-red-700`}
                    >
                      {titleText}
                    </h1>
                    <p
                      className={`subtitle pt-1 text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-amber-900 bp-1600:text-lg`}
                    >
                      {subtitleText}
                    </p>
                  </div>
                  <div className={`homepage-cta bp-900:pt-14`}>
                    <div
                      className={`cta-buttons flex flex-col bp-900:items-end bp-1200:flex bp-1200:flex-row bp-1200:justify-end`}
                    >
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
                </div>
              </div>
              <div
                id={`desktopBgImage`}
                className={`hidden absolute w-full h-full my-[100vh] bp-1100:block bp-1100:opacity-95 `}
                style={bgStyle}
              ></div>
              <div
                id={`beneathFoldContent`}
                className={`w-full bg-yellow-100 bp-1100:bg-[#f1f0caeb]`}
                tag={'section'}
              >
                <TeaserSlider
                  id={`bloomingNow`}
                  images={bloomingPlantImages}
                  headingChildren={
                    <BloomingHeadingText thisMonth={thisMonth} />
                  }
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
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const pageProps = await client.fetch(GET_LANDING_PAGE_DATA_QUERY)
  const bloomingProps = await client.fetch(
    GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY,
  )
  const seasonProps =
    await client.fetch(groq`*[!(_id in path('drafts.**')) && _type == "season" && ${CURRENT_MONTH_NUMBER}  in monthNumbers]
    {
      metaDescription,
    }`)
  return {
    props: {
      pageProps,
      bloomingProps,
      seasonProps,
    },
  }
}
