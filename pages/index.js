import { getClient } from '@lib/sanity';
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
import SeasonsPreview from 'components/SeasonsPreview';
import cx from 'classnames';
import Blooming from 'components/Blooming';

export default function HomePage({ pageData, bloomingNowData, seasonData }) {
    // console.log('environment ', process.env.NODE_ENV);
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
                                    <div
                                        className={`homepage-cta bp-900:pt-14`}
                                    >
                                        <div
                                            className={`cta-buttons flex flex-col bp-900:items-end bp-1200:flex bp-1200:flex-row bp-1200:justify-end`}
                                        >
                                            {buttonOne && (
                                                <Button
                                                    className={`btn-primary bp-900:mb-6`}
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
                                                    className={`btn-secondary bp-900:ml-8`}
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
                            </div>
                            <div
                                id={`desktopBgImage`}
                                className={`hidden absolute w-full h-full my-[100vh] bp-1100:block bp-1100:opacity-95 `}
                                style={bgStyle}
                            ></div>
                            <div
                                id={`beneathFoldContent`}
                                className={`w-full bg-yellow-100 bp-1100:bg-transparent`}
                                // bgParamObj={{bgColor: '#f5e8b5de', bgOpacity: '90'}}
                                tag={'section'}
                            >
                                <Blooming
                                    bloomingList={bloomingNowData}
                                    seasonData={seasonData[0]}
                                    className={``}
                                />
                                {/* {seasonData && (
                                    <SeasonsPreview
                                        seasonData={seasonData[0]}
                                        className={`pb-24 bp-1200:m-auto bp-1200:max-w-[90%] bp-1600:max-w-[70%]`}
                                    ></SeasonsPreview>
                                )}
                                {(bloomingNowData && bloomingNowData.length > 0) && (
                                    <BloomingNow
                                        bloomingList={bloomingNowData}
                                        className={`pb-24 bp-800:px-6 bp-1000:px-8 bp-1100:px-12 bp-800:pt-8 bp-1200:m-auto bp-1200:max-w-[90%] bp-1600:max-w-[70%]`}
                                    ></BloomingNow>
                                )} */}
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
}

export async function getStaticProps(context) {
    console.log('draft mode ', context)
    const pageData = await getClient().fetch(GET_LANDING_PAGE_DATA_QUERY);
    const bloomingNowData = await getClient().fetch(GET_BLOOMING_PLANTS_QUERY);
    const seasonData = await getClient().fetch(GET_CURRENT_SEASON_QUERY);
    return {
        props: { pageData, bloomingNowData, seasonData },
    };
}
