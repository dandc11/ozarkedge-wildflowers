import React from 'react'
import cx from 'classnames'

import { getNatureServeRankingColors } from '../utilities/helperUtil'
import IconInfo from './IconInfo'

const NatureServeMessage = (props) => {
  const { conservationRanking } = props
  const { bgColorVariable, textColorVariable, rankingText } =
    getNatureServeRankingColors(conservationRanking)
  return (
    <div className="natureserve-message">
      <div
        /* Data-driven ranking colors bridge into CSS via custom properties;
           static rules in natureserve.css consume --ns-bg / --ns-color. */
        style={{
          '--ns-bg': `var(${bgColorVariable})`,
          '--ns-color': `var(${textColorVariable})`,
        }}
        className="natureserve-message-text"
      >
        <IconInfo
          className="natureserve-icon-info"
          strokeColorVariable={textColorVariable}
          svgClassName="natureserve-icon-svg"
        />
        <p>
          Classified as <strong>{rankingText}</strong> based on the NatureServe
          Global Conservation Status Ranks. For more information on the
          rankings, visit
          <a
            className="natureserve-link"
            href={
              'https://explorer.natureserve.org/AboutTheData/DataTypes/ConservationStatusCategories'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            NatureServe<span className="sr-only"> (opens in new window)</span>.
          </a>
        </p>
        <div className="natureserve-message-bg"></div>
      </div>
    </div>
  )
}

export default NatureServeMessage
