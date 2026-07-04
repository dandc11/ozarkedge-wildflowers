import React from 'react'

/**
 * Always-visible "Sources & attribution" panel for the observation map.
 * Provenance is structural here, not decorative: it names the active observation
 * source and the standing basemap / ecoregion credits so it is always clear the
 * data comes from others, never from OzarkEdge.
 *
 * @param {Object} props
 * @param {string} [props.activeSourceLabel] - label of the active observation source
 * @param {string} [props.activeSourceUrl] - home URL of the active source
 * @param {string} [props.activeAttribution] - attribution string for the active source
 * @param {Array<{label:string, text:string, url?:string}>} [props.baseAttributions] - standing credits
 * @param {string} [props.sourcesNote] - editorial provenance statement
 */
const SourcesPanel = ({
  activeSourceLabel,
  activeSourceUrl,
  activeAttribution,
  baseAttributions = [],
  sourcesNote,
}) => {
  return (
    <aside className="cl-sources" aria-label="Data sources and attribution">
      <h3 className="cl-sources-heading fs-sm">Sources &amp; attribution</h3>
      {sourcesNote && <p className="cl-sources-note text-sm">{sourcesNote}</p>}
      <ul className="cl-sources-list text-sm">
        {activeAttribution && (
          <li>
            <span className="cl-sources-label">Observations:</span>{' '}
            {activeSourceUrl ? (
              <a href={activeSourceUrl} target="_blank" rel="noopener noreferrer">
                {activeAttribution}
              </a>
            ) : (
              activeAttribution
            )}
          </li>
        )}
        {baseAttributions.map((item) => (
          <li key={item.label}>
            <span className="cl-sources-label">{item.label}:</span>{' '}
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.text}
              </a>
            ) : (
              item.text
            )}
          </li>
        ))}
      </ul>
      {activeSourceLabel && (
        <p className="cl-sources-active text-sm">
          Currently showing observations from <strong>{activeSourceLabel}</strong>.
        </p>
      )}
    </aside>
  )
}

export default SourcesPanel
