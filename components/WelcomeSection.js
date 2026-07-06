import { PortableText } from '@portabletext/react'
import { createDataAttribute } from 'next-sanity'
import Link from 'next/link'
import React from 'react'

import ResponsiveImage from './ResponsiveImage'
import { IMG_SIZES } from '../utilities/constants'

const splitBodyComponents = {
  block: {
    normal: ({ children }) => <p className="welcome-lead">{children}</p>,
  },
}

const WelcomeSection = ({
  introImage,
  locationImage,
  introBody,
  locationBody,
  introHeading,
  locationHeading,
  showButtons = true,
  eyebrowText = 'Welcome',
  documentId,
  documentType,
}) => {
  const hasIntro = introBody?.length > 0
  const hasLocation = locationBody?.length > 0

  // Build `data-sanity` edit targets so Visual Editing overlays land on the
  // image field (standalone images carry no stega markers of their own).
  const imageDataAttr = (path) =>
    documentId && documentType
      ? createDataAttribute({ id: documentId, type: documentType, path }).toString()
      : undefined

  return (
    <section className="welcome-section">
      <div className="welcome-inner">
        {hasIntro && (
          <div className="welcome-split">
            <div className="welcome-text">
              <p className="welcome-eyebrow">
                <span className="welcome-circle" aria-hidden="true" />
                {eyebrowText}
              </p>
              <h2 className="welcome-heading">
                {introHeading || 'A field guide to our corner of the Ozarks'}
              </h2>
              <PortableText value={introBody} components={splitBodyComponents} />
              {showButtons && (
                <div className="welcome-actions">
                  <Link className="welcome-btn" href="/native-plants/">
                    Our native plant index{' '}
                    <span className="welcome-btn-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <div className="welcome-media">
              {introImage ? (
                <ResponsiveImage
                  image={introImage}
                  alt={introImage.alt || 'The Ozarkedge property'}
                  lqip={introImage.lqip}
                  sizes={IMG_SIZES.WELCOME_SPLIT}
                  figureClassName="welcome-figure"
                  className="welcome-media-img"
                  data-sanity-edit-target="true"
                  data-sanity={imageDataAttr('introImage')}
                />
              ) : (
                <div className="welcome-media-placeholder" aria-hidden="true" />
              )}
            </div>
          </div>
        )}

        {hasIntro && hasLocation && <hr className="welcome-rule" />}

        {hasLocation && (
          <div className="welcome-split welcome-split--reverse">
            <div className="welcome-text">
              <p className="welcome-eyebrow">
                <span className="welcome-circle" aria-hidden="true" />
                Where we are
              </p>
              <h2 className="welcome-heading">
                {locationHeading || 'Rooted in the Ozark Highlands'}
              </h2>
              <PortableText value={locationBody} components={splitBodyComponents} />
              {showButtons && (
                <div className="welcome-actions">
                  <Link className="welcome-btn" href="/about#our-story-heading">
                    Read our story{' '}
                    <span className="welcome-btn-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <div className="welcome-media">
              {locationImage ? (
                <figure className="welcome-eco-fig">
                  <ResponsiveImage
                    image={locationImage}
                    alt={
                      locationImage.alt ||
                      'Elevation map of the Ozark Plateaus across northern Arkansas and southern Missouri'
                    }
                    lqip={locationImage.lqip}
                    sizes={IMG_SIZES.WELCOME_SPLIT}
                    figureClassName="welcome-figure"
                    className="welcome-media-img"
                    showCaption={false}
                    data-sanity-edit-target="true"
                    data-sanity={imageDataAttr('locationImage')}
                  />
                  {locationImage.caption && (
                    <figcaption className="welcome-eco-caption">
                      {locationImage.caption}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="welcome-media-placeholder" aria-hidden="true" />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default WelcomeSection
