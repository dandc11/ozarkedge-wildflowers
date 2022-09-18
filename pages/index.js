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

const TitleText = ({ titleText, headingClass, underlineClass } = props) => {
    const underlineTextIndex = titleText.indexOf('edge Wildflowers');
    const title = underlineTextIndex ? (
        <h1 className={`${headingClass}`}>
            {`${titleText.substring(0, underlineTextIndex)}`}
            <span className={`${underlineClass} ${headingClass}`}>
                edge Wildflowers
            </span>
        </h1>
    ) : (
        <h1 className={`${headingClass}`}>{titleText}</h1>
    );
    return title;
};

export default function Home({ pageData }) {
    // console.log('environment ', process.env.NODE_ENV)
    console.log('pageData ', pageData);
    const {
        containerHero,
        containerTitle,
        title,
        underlineTitle,
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
                                    backgroundImage: `url('${urlFor(
                                        mainImage
                                    )}')`,
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
                                    className={`${containerTitle}`}
                                    // style={{
                                    //     background:
                                    //         mainImage.palette.darkMuted
                                    //             .background + 'e4',
                                    //     color: mainImage.palette.darkMuted
                                    //         .title,
                                    // }}
                                >
                                    <TitleText
                                        headingClass={title}
                                        underlineClass={underlineTitle}
                                        titleText={titleText}
                                    ></TitleText>
                                    {/* <h1 className={`${title}`}>{titleText}</h1> */}
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
