import cx from 'classnames'
import Heading from 'components/Heading'
import PortTextWrapper from 'components/PortTextWrapper'
import ResponsiveImage from 'components/ResponsiveImage'
import { useLiveQuery } from 'next-sanity/preview'
import React from 'react'
import { GET_ABOUT_PAGE_DATA_QUERY } from '../lib/queries'
import { readToken } from '../lib/sanity.api'
import { getClient } from '../lib/sanity.client'

const AboutPage = (props) => {
  const { pageProps = null } = props
  const [pageData] = useLiveQuery(pageProps, GET_ABOUT_PAGE_DATA_QUERY)
  console.log('pageData', pageData)

  const {
    _id: id,
    body: bodyPortableText,
    mainImage: mainImage,
    mobileImage,
  } = pageData[0]
  return (
    <>
      {pageData &&
        pageData.map(() => (
          <div
            className={`aboutpage-content w-full h-auto bg-oe-green-yellow-300 overflow-hidden flex flex-col relative p-0`}
            key={id}
          >
            <Heading
              className={
                'absolute content-center px-10 pt-20 mb-0 bp-900:pl-20'
              }
              showCircle={false}
              headingClassName={''}
            >
              About Ozarkedge
            </Heading>
            <PortTextWrapper
              className={`relative z-10 order-2 px-8 pb-6 max-w-[30rem] text-black`}
              value={bodyPortableText}
            ></PortTextWrapper>
            <ResponsiveImage
              image={mainImage}
              alt={mainImage?.alt || 'A picture of the Ozarkedge property'}
              disableHover
              loading="eager"
              figureClassName="h-full w-full"
              wrapperClassName="w-full h-[30rem] bg-oe-green-yellow-200 bp-900:order-2"
              className="rounded-none object-cover object-[80%_50%] w-full h-full "
            />
          </div>
        ))}
    </>
  )
}

export async function getStaticProps(context) {
  const client = getClient(
    context?.draftMode ? { token: readToken } : undefined,
  )
  const pageProps = await client.fetch(GET_ABOUT_PAGE_DATA_QUERY)
  return {
    props: {
      pageProps,
    },
  }
}

export default AboutPage
