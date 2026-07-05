import { stegaClean } from '@sanity/client/stega'
import { draftMode } from 'next/headers'

import { sanityFetch } from '../sanity/lib/sanity.live'
import { NOT_FOUND_PAGE_QUERY } from '../sanity/lib/queries'
import PortTextWrapper from '../components/PortTextWrapper'
import ResponsiveImage from '../components/ResponsiveImage'

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default async function NotFound() {
  const { isEnabled: isDraftMode } = await draftMode()
  const notFoundPageQueryResponse = await sanityFetch({
    query: NOT_FOUND_PAGE_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
    stega: isDraftMode,
  })
  const notFoundPageData = notFoundPageQueryResponse?.data?.[0] ?? null
  const menuButtonColor = stegaClean(notFoundPageData?.menuButtonColor) || 'light'

  return (
    <div className={`page-not-found nav-${menuButtonColor} text-light`}>
      {notFoundPageData?.heading && (
        <div className="heading-wrapper">
          <h1 className="">
            <span className="first-word">Sorry,</span>
            <br className="line-break"></br>
            <span className="heading-rest">
              the page you&apos;re looking for has not been found.
            </span>
          </h1>
        </div>
      )}
      <div className="message">
        <PortTextWrapper className={`relative`} value={notFoundPageData.message} />
      </div>
      <div className="circle-img">
        <ResponsiveImage
          image={notFoundPageData.image}
          alt={notFoundPageData.image?.alt || 'A picture of the Ozarkedge property'}
          disableHover
          disablePointer
          loading="eager"
          figureClassName="h-full w-full"
          wrapperClassName="w-full h-full"
          className="w-full h-full rounded-none cover"
        />
      </div>
    </div>
  )
}
