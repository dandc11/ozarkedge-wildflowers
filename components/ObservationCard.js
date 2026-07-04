import React from 'react'

/**
 * Detail card for a single observation selected on the map (or from the list).
 * Frames the record honestly as "observed here," links back to the source record,
 * and shows the license — the observation is a fact from someone else, attributed.
 *
 * @param {Object} props
 * @param {Object} props.feature - a normalized GeoJSON Feature
 * @param {Function} [props.onClose] - called when the card's close button is pressed
 */
const ObservationCard = ({ feature, onClose }) => {
  if (!feature?.properties) return null

  const { scientificName, commonName, observedOn, sourceUrl, license, attribution, photoUrl } =
    feature.properties

  const primaryName = commonName || scientificName || 'Unknown species'
  const showScientific = scientificName && scientificName !== primaryName

  return (
    <div className="cl-obs-card" role="dialog" aria-label={`Observation: ${primaryName}`}>
      <button type="button" className="cl-obs-card-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- external iNaturalist thumbnail, not a Sanity asset
        <img className="cl-obs-card-photo" src={photoUrl} alt="" width={75} height={75} />
      )}
      <div className="cl-obs-card-body">
        <p className="cl-obs-card-name">{primaryName}</p>
        {showScientific && <p className="cl-obs-card-sci">{scientificName}</p>}
        <p className="cl-obs-card-meta text-sm">
          Observed here{observedOn ? ` on ${observedOn}` : ''}.
        </p>
        {sourceUrl && (
          <a
            className="cl-obs-card-link text-sm"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View the source record →
          </a>
        )}
        {(attribution || license) && (
          <p className="cl-obs-card-attribution text-sm">
            {attribution}
            {license ? ` · ${license}` : ''}
          </p>
        )}
      </div>
    </div>
  )
}

export default ObservationCard
