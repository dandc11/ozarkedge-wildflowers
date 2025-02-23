'use client'
import React, { useState, useEffect } from 'react'
import cx from 'classnames'

import { getNatureServeRankingColors } from '../utilities/helperUtil'
import IconInfo from './IconInfo'

/**
 * NatureServeBadge component displays a badge with conservation ranking information.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.conservationRanking=''] - The conservation ranking.
 * @param {string} [props.className=''] - Additional CSS class for the component.
 * @param {Function} [props.showMoreInfoSection=()=>{}] - Callback function to show more information section.
 * @returns {JSX.Element} The rendered NatureServeBadge component.
 */
const NatureServeBadge = (props) => {
  const {
    conservationRanking = '',
    className = '',
    showMoreInfoSection = () => {},
  } = props

  const [isExpanded, setIsExpanded] = useState(false)
  const { bgColorVariable, textColorVariable, rankingText } =
    getNatureServeRankingColors(conservationRanking)

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    showMoreInfoSection(isExpanded)
  }, [showMoreInfoSection, isExpanded])

  let classNames = cx('natureserve-badge', className, { expanded: isExpanded })

  return (
    <div
      id={'natureServeBadge'}
      className={classNames}
      style={{
        backgroundColor: `var(${bgColorVariable})`,
        color: `var(${textColorVariable})`,
      }}
      onClick={toggleIsExpanded}
    >
      <span
        className="natureserve-badge-text"
        style={{
          backgroundColor: `var(${bgColorVariable})`,
          color: `var(${textColorVariable})`,
        }}
      >
        {rankingText}
        <IconInfo strokeColorVariable={textColorVariable} />
      </span>
    </div>
  )
}

export default NatureServeBadge
