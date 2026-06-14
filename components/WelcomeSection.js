import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import React from 'react'

import ResponsiveImage from './ResponsiveImage'
import { IMG_SIZES } from '../utilities/constants'

const splitBodyComponents = {
  block: {
    normal: ({ children }) => <p className="welcome-lead">{children}</p>,
  },
}

const WelcomeSection = ({ introPhoto, ecoRegionMap, introBody, locationBody, showButtons = true }) => {
  return (
    <section className="welcome-section">
      <div className="welcome-inner">

        <div className="welcome-split">
          <div className="welcome-text">
            <p className="welcome-eyebrow">
              <span className="welcome-circle" aria-hidden="true" />
              Welcome
            </p>
            <h2 className="welcome-heading">A field guide to our corner of the Ozarks</h2>
            {introBody && <PortableText value={introBody} components={splitBodyComponents} />}
            {showButtons && (
              <div className="welcome-actions">
                <Link className="welcome-btn" href="/native-plants/">
                  Browse native plants <span className="welcome-btn-arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
          <div className="welcome-media">
            {introPhoto ? (
              <ResponsiveImage
                image={introPhoto}
                alt={introPhoto.alt || 'The Ozarkedge property'}
                lqip={introPhoto.lqip}
                sizes={IMG_SIZES.WELCOME_SPLIT}
                figureClassName="welcome-figure"
                className="welcome-media-img"
              />
            ) : (
              <div className="welcome-media-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>

        <hr className="welcome-rule" />

        <div className="welcome-split welcome-split--reverse">
          <div className="welcome-text">
            <p className="welcome-eyebrow">
              <span className="welcome-circle" aria-hidden="true" />
              Who &amp; where
            </p>
            <h2 className="welcome-heading">Rooted in the Ozark Highlands</h2>
            {locationBody && <PortableText value={locationBody} components={splitBodyComponents} />}
            {showButtons && (
              <div className="welcome-actions">
                <Link className="welcome-btn" href="/about">
                  About the project <span className="welcome-btn-arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
          <div className="welcome-media">
            {ecoRegionMap ? (
              <figure className="welcome-eco-fig">
                <ResponsiveImage
                  image={ecoRegionMap}
                  alt={ecoRegionMap.alt || 'Elevation map of the Ozark Plateaus across northern Arkansas and southern Missouri'}
                  lqip={ecoRegionMap.lqip}
                  sizes={IMG_SIZES.WELCOME_SPLIT}
                  figureClassName="welcome-figure"
                  className="welcome-media-img"
                  showCaption={false}
                />
                {ecoRegionMap.caption && (
                  <figcaption className="welcome-eco-caption">{ecoRegionMap.caption}</figcaption>
                )}
              </figure>
            ) : (
              <div className="welcome-media-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

export default WelcomeSection
