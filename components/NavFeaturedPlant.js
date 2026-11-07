import React from 'react'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'

import { getPathFromDocType } from '../utilities/helperUtil'
import { getPrimaryCommonName } from '../utilities/menuUtil'

import ResponsiveImage from './ResponsiveImage'

/**
 * The editor-picked plant shown at the top of the desktop menu. The whole card is one link.
 * @param {object} featuredPlant - The referenced plant (plantName, slug, docType, previewImage)
 * @param {string} [featuredNote] - Optional one-line note shown under the name
 * @param {function} onNavigate - Called when the link is followed
 */
const NavFeaturedPlant = ({ featuredPlant, featuredNote, onNavigate }) => {
  const slug = stegaClean(featuredPlant?.slug)
  if (!slug) return null

  return (
    <section className="nav-featured" aria-labelledby="nav-featured-heading">
      <h2 id="nav-featured-heading" className="nav-eyebrow">
        Featured plant
      </h2>
      <Link
        href={getPathFromDocType(stegaClean(featuredPlant.docType) || 'nativePlant', slug)}
        className="nav-card-link"
        onClick={onNavigate}
      >
        <ResponsiveImage
          alt=""
          className="nav-card-img"
          disableHover
          disablePointer
          image={featuredPlant.previewImage}
          loading="lazy"
          quality={80}
          showCaption={false}
          sizes="(min-width: 1200px) 33vw, 0px"
          width="800"
          wrapperClassName="nav-card-img-wrapper nav-featured-img"
        />
        <span className="nav-card-name nav-featured-name">
          {getPrimaryCommonName(featuredPlant.plantName)}
        </span>
        <span className="nav-card-meta">
          {featuredNote && <>{featuredNote} · </>}
          View <span aria-hidden="true">→</span>
        </span>
      </Link>
    </section>
  )
}

export default NavFeaturedPlant
