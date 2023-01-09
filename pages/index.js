import { sanityClient } from '@lib/sanity.server';
import {
    GET_LANDING_PAGE_DATA_QUERY,
    GET_BLOOMING_PLANTS_QUERY,
    GET_CURRENT_SEASON_QUERY,
} from '@lib/queries';
import {
    buildBackgroundStyleObject,
    getImagePaletteBackgroundColor,
} from '@lib/utilities/imageUtil';
import React from 'react';
import Button from 'components/Button';
import BloomingNow from 'components/BloomingNow';
import cx from 'classnames';

export default function HomePage({ pageData, bloomingNowData, seasonData }) {
    // console.log('environment ', process.env.NODE_ENV);
    // console.log('season data ', seasonData);
    // console.log('blooming data ', bloomingNowData);
    console.log('pageData ', pageData[0]);
    const {
        id,
        titleText,
        subtitleText,
        mainImage: bgImage,
        mobileImage: bgImageSmall,
        buttonOne,
        buttonTwo,
    } = pageData[0];
    const aboveFoldBackground = { bgImage, bgImageSmall };
    const bgStyle = buildBackgroundStyleObject(aboveFoldBackground);
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
                                className={`-z-10 w-full h-screen bg-center bg-cover bp-900:absolute bp-900:top-0 bp-900:left-0 bp-900:bg-cover bp-900:bg-scroll bp-1100:fixed `}
                                id="landingImageContainer"
                                style={bgStyle}
                            ></div>
                            <section className={`above-fold bp-900:h-screen`}>
                                <div
                                    className={`homepage-info-section absolute px-4 pt-12 pb-4 top-0 flex flex-col bg-transparent justify-between w-full h-screen bp-900:justify-start bp-1200:pr-6`}
                                >
                                    <div
                                        className={`homepage-title self-center text-center bp-900:self-end bp-900:text-right`}
                                    >
                                        <h1
                                            className={`title font-display pb-1 font-bold leading-none bp-600:leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-amber-900`}
                                        >
                                            {titleText}
                                        </h1>
                                        <p
                                            className={`subtitle pt-1 text-base bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-amber-900 bp-1600:text-lg`}
                                        >
                                            {subtitleText}
                                        </p>
                                    </div>
                                    <div
                                        className={`homepage-cta bp-900:pt-14`}
                                    >
                                        <div
                                            className={`cta-buttons flex flex-col bp-900:items-end bp-1200:flex bp-1200:flex-row bp-1200:justify-end`}
                                        >
                                            {buttonOne && (
                                                <Button
                                                    className={`btn-secondary mb-6`}
                                                    internalLink={
                                                        buttonOne.slug
                                                    }
                                                    linkDocType={
                                                        buttonOne.docType
                                                    }
                                                >
                                                    See what's blooming
                                                </Button>
                                            )}
                                            {buttonTwo && (
                                                <Button
                                                    className={`btn-secondary ml-8`}
                                                    internalLink={
                                                        buttonTwo.slug
                                                    }
                                                    linkDocType={
                                                        buttonTwo.docType
                                                    }
                                                >
                                                    Explore native wildflowers
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section
                                className={
                                    'blooming-container w-full bg-yellow-100'
                                }
                                // bgParamObj={{bgColor: '#f5e8b5de', bgOpacity: '90'}}
                                tag={'section'}
                            >
                                {bloomingNowData && (
                                    <BloomingNow
                                        plantList={bloomingNowData}
                                        seasonData={seasonData}
                                    ></BloomingNow>
                                )}
                            </section>
                        </div>
                    ))}
            </div>
        </>
    );
}

export async function getStaticProps(context) {
    const pageData = await sanityClient.fetch(GET_LANDING_PAGE_DATA_QUERY);
    const bloomingNowData = await sanityClient.fetch(GET_BLOOMING_PLANTS_QUERY);
    const seasonData = await sanityClient.fetch(GET_CURRENT_SEASON_QUERY);
    return {
        props: { pageData, bloomingNowData, seasonData },
    };
}
