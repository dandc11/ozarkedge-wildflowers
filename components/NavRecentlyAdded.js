import React from 'react'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'

import { getPathFromDocType } from '../utilities/helperUtil'
import { formatAddedDate, getPrimaryCommonName } from '../utilities/menuUtil'

import ResponsiveImage from './ResponsiveImage'

/**
 * The row of the three newest plant pages. Each tile is one link.
 * @param {Array} plants - The newest plants (plantName, slug, docType, addedAt, previewImage)
 * @param {function} onNavigate - Called when a link is followed
 */
const NavRecentlyAdded = ({ plants, onNavigate }) => {
  if (!plants?.length) return null

  return (
    <section className="nav-recent" aria-labelledby="nav-recent-heading">
      <div className="nav-recent-header">
        <h2 id="nav-recent-heading" className="nav-eyebrow">
          Recently added
        </h2>
        <Link
          href="/native-plants"
          className="nav-more-link"
          aria-label="All plants A–Z"
          onClick={onNavigate}
        >
          <span className="nav-more-long">All plants A–Z</span>
          <span className="nav-more-short">All</span> <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="nav-recent-grid">
        {plants.map((plant) => {
          const slug = stegaClean(plant.slug)
          const addedDate = formatAddedDate(plant.addedAt)
          return (
            <li key={slug}>
              <Link
                href={getPathFromDocType(stegaClean(plant.docType) || 'nativePlant', slug)}
                className="nav-card-link"
                onClick={onNavigate}
              >
                <ResponsiveImage
                  alt=""
                  className="nav-card-img"
                  disableHover
                  disablePointer
                  image={plant.previewImage}
                  loading="lazy"
                  quality={80}
                  showCaption={false}
                  sizes="(min-width: 1200px) 150px, 30vw"
                  width="400"
                  wrapperClassName="nav-card-img-wrapper nav-tile-img"
                />
                <span className="nav-card-name">{getPrimaryCommonName(plant.plantName)}</span>
                {addedDate && <span className="nav-card-meta nav-tile-date">{addedDate}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default NavRecentlyAdded
