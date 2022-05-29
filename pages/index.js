import { groq } from 'next-sanity'
import { useRouter } from 'next/router'
import { urlFor, usePreviewSubscription } from '@lib/sanity'
import { sanityClient } from '@lib/sanity.server'
import Image from 'next/image'
import NextImage from './../components/NextImage'
import { landingPageQuery } from '@lib/queries'
import React from 'react'

export default function Home({ pageData }) {
    // console.log('environment ', process.env.NODE_ENV)
    console.log('pageData ', pageData)

    let cssProperties = {
        '--hero-bg-color': '#fff',
        '--hero-text-color': '#000',
    }

    return (
        <div>
            {pageData &&
                pageData.map((data) => (
                    <React.Fragment key={data.id}>
                        <div className="container-hero">
                            <div className="container-title">
                                <h1>{data.titleText}</h1>
                                <h3>{data.subtitleText}</h3>
                            </div>
                            <div className="container-hero-img">
                                <NextImage
                                    classNames={'hero-image'}
                                    altText={data.mainImage.alt}
                                    imgAsset={data.mainImage}
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
                        </div>
                    </React.Fragment>
                ))}
        </div>
    )
}

export async function getStaticProps(context) {
    const pageData = await sanityClient.fetch(landingPageQuery)
    return {
        props: { pageData },
    }
}
