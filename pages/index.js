import { groq } from 'next-sanity';
import { useRouter } from 'next/router';
import { urlFor, usePreviewSubscription } from '@lib/sanity';
import { sanityClient } from '@lib/sanity.server';
import NextImage from './../components/NextImage';
import {
    getImagePaletteBackgroundColor,
    getImagePaletteForegroundColor,
    getImagePaletteTitleColor,
} from '@lib/helperFunctions';
import { landingPageQuery } from '@lib/queries';
import React from 'react';

export default function Home({ pageData }) {
    // console.log('environment ', process.env.NODE_ENV)
    console.log('pageData ', pageData);

    let cssProperties = {
        '--hero-bg-color': '#fff',
        '--hero-text-color': '#000',
    };

    let mainImageBgColor;
    return (
        <div>
            {pageData &&
                pageData.map(
                    ({ id, titleText, subtitleText, mainImage } = data) => (
                        <React.Fragment key={id}>
                            <div
                                className="full-bg-img container-hero"
                                style={{
                                    backgroundColor:
                                        getImagePaletteBackgroundColor(
                                            mainImage,
                                            'darkVibrant'
                                        ),
                                    color: getImagePaletteTitleColor(
                                        mainImage,
                                        'darkVibrant'
                                    ),
                                }}
                            >
                                <div className="full-bg-img container-hero-img">
                                    <NextImage
                                        classNames={'hero-image'}
                                        altText={mainImage.alt}
                                        imgAsset={mainImage}
                                        quality={`100`}
                                    />
                                    {/* <img
                                    className="hero-img"
                                    src={urlFor(data.mainImage)
                                        .height(550)
                                        .width(550)
                                        .url()}
                                    alt={data.mainImage.alt}
                                /> */}
                                </div>
                                <div
                                    className="full-bg-img container-title"
                                    // style={{
                                    //     background:
                                    //         mainImage.palette.darkMuted
                                    //             .background + 'e4',
                                    //     color: mainImage.palette.darkMuted
                                    //         .title,
                                    // }}
                                >
                                    <h1>{titleText}</h1>
                                    <p>{subtitleText}</p>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                )}
        </div>
    );
}

export async function getStaticProps(context) {
    const pageData = await sanityClient.fetch(landingPageQuery);
    return {
        props: { pageData },
    };
}
