import React from 'react'

import { displaySeasonName, titleCase } from '../utilities/helperUtil'
import { IMG_SIZES } from '../utilities/constants'

import CustomLink from './CustomLink'
import ResponsiveImage from './ResponsiveImage'

/**
 * Teaser grid of recent field notes for the section landing page.
 * Uses ResponsiveImage (never a raw <Image>) and CustomLink to route to each note.
 *
 * @param {Object} props
 * @param {Array} props.notes - fieldNote teaser documents
 * @param {string} [props.heading] - section heading
 */
const FieldNoteTeasers = ({ notes = [], heading = 'Field notes' }) => {
  if (!notes.length) return null

  return (
    <section className="cl-notes" aria-labelledby="cl-notes-heading">
      <h2 id="cl-notes-heading" className="fs-2xl">
        {heading}
      </h2>
      <ul className="cl-notes-grid">
        {notes.map((note) => {
          const seasonName = note?.season?.seasonName
          return (
            <li key={note._id} className="cl-note-card">
              <CustomLink docType="fieldNote" slug={note.slug} className="cl-note-card-link">
                {note.mainImage?.asset?._ref && (
                  <ResponsiveImage
                    alt={note.mainImage?.alt || note.title || 'Field note'}
                    image={note.mainImage}
                    figureClassName="cl-note-card-figure"
                    sizes={IMG_SIZES.TEASER}
                    showCaption={false}
                  />
                )}
                <div className="cl-note-card-body">
                  {seasonName && (
                    <span className="cl-note-card-season text-sm">
                      {titleCase(displaySeasonName(seasonName))}
                    </span>
                  )}
                  <h3 className="cl-note-card-title fs-lg">{note.title}</h3>
                  {note.metaDescription && (
                    <p className="cl-note-card-excerpt text-sm">{note.metaDescription}</p>
                  )}
                </div>
              </CustomLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default FieldNoteTeasers
