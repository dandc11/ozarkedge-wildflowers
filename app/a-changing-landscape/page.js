import React from 'react'
import { draftMode } from 'next/headers'
import { stegaClean } from '@sanity/client/stega'

import ChangingLandscapeMap from '../../components/ChangingLandscapeMap'
import CuratedShelf from '../../components/CuratedShelf'
import FieldNoteTeasers from '../../components/FieldNoteTeasers'
import PortTextWrapper from '../../components/PortTextWrapper'
import ResponsiveImage from '../../components/ResponsiveImage'
import HeadingDisplay from '../../components/HeadingDisplay'
import { GET_CHANGING_LANDSCAPE_PAGE_DATA_QUERY } from '../../sanity/lib/queries'
import { IMG_SIZES } from '../../utilities/constants'
import { OBSERVATION_SOURCES, TAXON_GROUPS } from '../../utilities/observationSources'
import { sanityFetch } from '../../sanity/lib/sanity.live'
import { urlForImage } from '../../sanity/lib/sanity.image'

const DEFAULT_TITLE = 'A Changing Landscape'

/**
 * Client-safe, serializable descriptors of the taxon groups and enabled
 * observation sources passed into the (client) map component.
 */
const taxonGroupsForClient = Object.fromEntries(
  Object.entries(TAXON_GROUPS).map(([key, group]) => [key, { key: group.key, label: group.label }]),
)
const enabledSources = Object.values(OBSERVATION_SOURCES)
  .filter((source) => source.enabled)
  .map((source) => ({
    key: source.key,
    label: source.label,
    homeUrl: source.homeUrl,
    attribution: source.attribution,
  }))

/**
 * Generates metadata for the "A Changing Landscape" section landing page.
 */
export async function generateMetadata() {
  const { data } = await sanityFetch({
    query: GET_CHANGING_LANDSCAPE_PAGE_DATA_QUERY,
    stega: false,
  })
  const title = stegaClean(data?.title) || DEFAULT_TITLE
  const description = stegaClean(data?.metaDescription) || undefined
  const ogImage = data?.mainImage
    ? urlForImage(data.mainImage, { width: 1200, height: 630 })?.url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const ChangingLandscapePage = async () => {
  const { isEnabled: isDraftMode } = await draftMode()
  const queryResponse = await sanityFetch({
    query: GET_CHANGING_LANDSCAPE_PAGE_DATA_QUERY,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })
  const data = queryResponse?.data ?? null

  const title = data?.title || DEFAULT_TITLE
  const menuButtonColor = stegaClean(data?.menuButtonColor) || 'light'
  const intro = data?.intro ?? []
  const curatedTools = data?.curatedTools ?? []
  const fieldNotes = data?.fieldNotes ?? []
  const sourcesNote = stegaClean(data?.sourcesNote) || undefined

  return (
    <div className={`changing-landscape-page nav-${menuButtonColor}`}>
      {data?.mainImage?.asset?._ref ? (
        <div className="changing-landscape-header relative">
          <HeadingDisplay absolute headingLevel={1} headingClassName={'text-display'}>
            <span className={`no-wrap text-${menuButtonColor}`}>{title}</span>
          </HeadingDisplay>
          <ResponsiveImage
            alt={data?.mainImage?.alt || title}
            className="w-full h-full"
            disableHover
            disablePointer
            fetchPriority="high"
            figureClassName="h-full w-full"
            image={data.mainImage}
            priority
            quality={90}
            sizes={IMG_SIZES.HERO_DESKTOP_SIZES}
            wrapperClassName="banner-img"
          />
        </div>
      ) : (
        <header className="changing-landscape-header-plain content-well">
          <HeadingDisplay headingLevel={1} headingClassName={'text-display'}>
            {title}
          </HeadingDisplay>
        </header>
      )}

      <div className="changing-landscape-body content-well">
        {intro.length > 0 && (
          <PortTextWrapper
            className="changing-landscape-intro"
            value={intro}
            lightboxIdentifier="changingLandscape"
            documentId={data?._id}
            documentType="changingLandscapePage"
          />
        )}

        <ChangingLandscapeMap
          taxonGroups={taxonGroupsForClient}
          sources={enabledSources}
          sourcesNote={sourcesNote}
        />

        <CuratedShelf tools={curatedTools} heading={stegaClean(data?.shelfHeading) || undefined} />

        <FieldNoteTeasers
          notes={fieldNotes}
          heading={stegaClean(data?.fieldNotesHeading) || undefined}
        />
      </div>
    </div>
  )
}

export default ChangingLandscapePage
