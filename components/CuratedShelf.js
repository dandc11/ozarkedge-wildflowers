import React from 'react'

/**
 * The curated "what to read / what to use" shelf.
 * A simple, accessible card grid of authoritative external tools and sources, each
 * with an honest "good for" note and an optional "watch out" caveat. Every card
 * links out (these are other people's tools, not ours).
 *
 * @param {Object} props
 * @param {Array} props.tools - curatedTool documents
 * @param {string} [props.heading] - section heading
 */
const CuratedShelf = ({ tools = [], heading = 'What to read, what to use' }) => {
  if (!tools.length) return null

  return (
    <section className="cl-shelf" aria-labelledby="cl-shelf-heading">
      <h2 id="cl-shelf-heading" className="fs-2xl">
        {heading}
      </h2>
      <ul className="cl-shelf-grid">
        {tools.map((tool) => (
          <li key={tool._id} className="cl-shelf-card">
            <div className="cl-shelf-card-head">
              <h3 className="cl-shelf-card-name fs-lg">
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  {tool.name}
                </a>
              </h3>
              {tool.category && <span className="cl-shelf-card-category text-sm">{tool.category}</span>}
            </div>
            {tool.goodFor && (
              <p className="cl-shelf-card-good text-sm">
                <span className="cl-shelf-card-label">Good for:</span> {tool.goodFor}
              </p>
            )}
            {tool.watchOut && (
              <p className="cl-shelf-card-watch text-sm">
                <span className="cl-shelf-card-label">Watch out:</span> {tool.watchOut}
              </p>
            )}
            {Array.isArray(tool.regionTags) && tool.regionTags.length > 0 && (
              <ul className="cl-shelf-card-tags text-sm" aria-label="Regions">
                {tool.regionTags.map((tag) => (
                  <li key={tag} className="cl-shelf-card-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CuratedShelf
