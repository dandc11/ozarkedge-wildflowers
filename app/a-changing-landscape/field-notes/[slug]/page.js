import React from 'react'
import { draftMode } from 'next/headers'
import { stegaClean } from '@sanity/client/stega'
import { notFound } from 'next/navigation'

import PortTextWrapper from '../../../../components/PortTextWrapper'
import ResponsiveImage from '../../../../components/ResponsiveImage'
import CustomLink from '../../../../components/CustomLink'
import HeadingDisplay from '../../../../components/HeadingDisplay'
import { displaySeasonName, titleCase } from '../../../../utilities/helperUtil'
import {
  GET_ALL_FIELD_NOTE_SLUGS_QUERY,
  GET_FIELD_NOTE_PAGE_DATA_QUERY,
} from '../../../../sanity/lib/queries'
import { IMG_SIZES } from '../../../../utilities/constants'
import { sanityFetch } from '../../../../sanity/lib/sanity.live'
import { urlForImage } from '../../../../sanity/lib/sanity.image'

/**
 * Generates metadata for a field note page using Sanity data.
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: pageData } = await sanityFetch({
    query: GET_FIELD_NOTE_PAGE_DATA_QUERY,
    params: resolvedParams,
    stega: false,
  })

  if (!pageData?._id) {
    return { title: 'Field Note Not Found' }
  }

  const title = stegaClean(pageData.title) || 'Field Note'
  const description = stegaClean(pageData.metaDescription) || undefined
  const ogImage = pageData.mainImage
    ? urlForImage(pageData.mainImage, { width: 1200, height: 630 })?.url()
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

/**
 * Generate the static params for all published field notes.
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: GET_ALL_FIELD_NOTE_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  const slugs = Array.isArray(data) ? data : []
  return slugs
    .filter(Boolean)
    .map((slug) => (typeof slug === 'string' ? { slug } : { slug: slug?.slug }))
    .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
}

const FieldNotePage = async (props) => {
  const { isEnabled: isDraftMode } = await draftMode()
  const params = await props.params
  const { data: pageData } = await sanityFetch({
    query: GET_FIELD_NOTE_PAGE_DATA_QUERY,
    params,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: isDraftMode,
  })

  if (!pageData?._id) {
    notFound()
  }

  const { title = 'Field Note', body = [], mainImage, season, ecoregions = [], species = [] } = {
    ...pageData,
  }
  const seasonName = season?.seasonName

  return (
    <article className="field-note-page">
      {mainImage?.asset?._ref && (
        <div className="field-note-header relative">
          <ResponsiveImage
            alt={mainImage?.alt || title}
            className="w-full h-full"
            disableHover
            disablePointer
            fetchPriority="high"
            figureClassName="h-full w-full"
            image={mainImage}
            priority
            quality={90}
            sizes={IMG_SIZES.HERO_DESKTOP_SIZES}
            wrapperClassName="banner-img"
          />
        </div>
      )}

      <div className="field-note-body content-well">
        <HeadingDisplay headingLevel={1} headingClassName={'text-display'}>
          {title}
        </HeadingDisplay>
        {seasonName && (
          <p className="field-note-season text-sm">
            {titleCase(displaySeasonName(seasonName))} field note
          </p>
        )}

        <PortTextWrapper
          className="relative"
          lightboxIdentifier="fieldNote"
          value={body}
          documentId={pageData._id}
          documentType="fieldNote"
        />

        {species.length > 0 && (
          <section className="field-note-related" aria-labelledby="fn-species-heading">
            <h2 id="fn-species-heading" className="fs-lg">
              Species mentioned
            </h2>
            <ul className="field-note-species-list">
              {species.map((plant) => {
                const commonName = plant?.plantName?.commonName?.[0]
                const botanicalName = plant?.plantName?.botanicalName?.[0]
                const label = commonName || botanicalName || 'Native plant'
                return (
                  <li key={plant.slug}>
                    <CustomLink docType="nativePlant" slug={plant.slug}>
                      {label}
                    </CustomLink>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {ecoregions.length > 0 && (
          <section className="field-note-related" aria-labelledby="fn-ecoregion-heading">
            <h2 id="fn-ecoregion-heading" className="fs-lg">
              Ecoregions
            </h2>
            <ul className="field-note-ecoregion-list">
              {ecoregions.map((eco) => (
                <li key={eco.slug || eco.name}>
                  {eco.name}
                  {eco.epaCode ? ` (EPA ${eco.epaCode})` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}

export default FieldNotePage
