import { groq } from 'next-sanity';
import { useRouter } from 'next/router';
import { sanityClient } from '@lib/sanity.server';
import ResponsiveImage from '../components/ResponsiveImage';
import { landingPageQuery } from '@lib/queries';
import React from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import BloomingNow from 'components/BloomingNow';

export default function Home({ pageData }) {
    // console.log('environment ', process.env.NODE_ENV)
    console.log('pageData ', pageData);

    return (
        <div>
            {pageData &&
                pageData.map(
                    ({
                        id,
                        titleText,
                        subtitleText,
                        mainImage,
                        mobileImage,
                    } = data) => (
                        <Container
                            classes={[
                                'w-l-100',
                                'w-m-100',
                                'w-s-100',
                                'home-page-content',
                            ]}
                            display={'flex'}
                            bgImageLarge={mainImage}
                            bgImageMedium={mainImage}
                            bgImageSmall={mobileImage}
                            tag={'div'}
                        >
                            <section
                                className={`above-fold h-s-100 flex justify-center align-start`}
                            >
                                <div
                                    className={`homepage-text flex flex-column w-s-100 h-s-100 justify-start align-end`}
                                >
                                    <h1 className={`homepage-title`}>
                                        {titleText}
                                    </h1>
                                    <div className={`homepage-cta`}>
                                        <p className={`subtitle`}>
                                            {subtitleText}
                                        </p>
                                        <div
                                            className={`cta-buttons flex justify-space-between`}
                                        >
                                            <Button classes={['btn-primary']}>
                                                See what's blooming
                                            </Button>
                                            <Button classes={['btn-primary']}>
                                                Explore native wildflowers
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <Container
                                classes={[
                                    'w-l-100',
                                    'w-m-100',
                                    'w-s-100',
                                    'h-s-100',
                                ]}
                                bgColor={'#f5e8b5de'}
                                // opacity={'90'}
                                tag={'section'}
                            >
                                <BloomingNow></BloomingNow>
                            </Container>
                        </Container>
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
