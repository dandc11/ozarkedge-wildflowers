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
import landingPageStyles from './../styles/pages/landing-page.module.scss';

export default function Home({ pageData }) {
    // console.log('environment ', process.env.NODE_ENV)
    console.log('pageData ', pageData);
    const {
        containerHero,
        containerHeroImg,
        containerTitle,
        title,
        subtitle,
        hRule,
    } = landingPageStyles;
    return (
        <div>
            {pageData &&
                pageData.map(
                    ({ id, titleText, subtitleText, mainImage } = data) => (
                        <React.Fragment key={id}>
                            <div
                                className={`${containerHero}`}
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
                                <div
                                    className={`${containerHeroImg}`}
                                    style={{
                                        backgroundImage: `url('${urlFor(
                                            mainImage
                                        )}')`,
                                    }}
                                >
                                    {/* <NextImage
                                        classNames={'hero-image'}
                                        altText={mainImage.alt}
                                        imgAsset={mainImage}
                                        quality={`100`}
                                    /> */}
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
                                    className={`${containerTitle}`}
                                    // style={{
                                    //     background:
                                    //         mainImage.palette.darkMuted
                                    //             .background + 'e4',
                                    //     color: mainImage.palette.darkMuted
                                    //         .title,
                                    // }}
                                >
                                    <h1 className={`${title}`}>{titleText}</h1>
                                    <hr className={`${hRule}`}></hr>
                                    <p className={`${subtitle}`}>
                                        {subtitleText}
                                    </p>
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
