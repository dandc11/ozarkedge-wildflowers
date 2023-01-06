import { sanityClient } from '@lib/sanity.server';
import {
    GET_LANDING_PAGE_DATA_QUERY,
    GET_BLOOMING_PLANTS_QUERY,
    GET_CURRENT_SEASON_QUERY,
} from '@lib/queries';
import { buildBackgroundStyleObject, getImagePaletteBackgroundColor } from '@lib/utilities/imageUtil';
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
                        <div className="homepage-content" key={id}>
                            <div
                                id="landingImageContainer"
                                style={bgStyle}
                            ></div>
                            <section className={`above-fold`}>
                                <div
                                    className={`homepage-info-section w-s-100 h-s-100`}
                                >
                                    <div className={`homepage-title`}>
                                        <h1 className={`title`}>{titleText}</h1>
                                        <p className={`subtitle`}>
                                            {subtitleText}
                                        </p>
                                    </div>
                                    <div className={`homepage-cta`}>
                                        <div className={`cta-buttons`}>
                                            {buttonOne && (
                                                <Button
                                                    className={['btn-secondary']}
                                                    internalLink={
                                                        buttonOne.slug
                                                    }
                                                    linkDocType={buttonOne.docType}
                                                >
                                                    See what's blooming
                                                </Button>
                                            )}
                                            {buttonTwo && (
                                                <Button
                                                    className={['btn-secondary']}
                                                    internalLink={
                                                        buttonTwo.slug
                                                    }
                                                    linkDocType={buttonTwo.docType}
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
                                    'blooming-container w-l-100 w-m-100 w-s-100'
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
