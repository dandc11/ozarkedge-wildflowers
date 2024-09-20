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

  let classNames = cx(
    ` p-5 rounded-xl text-base h-8 w-fit self-start cursor-pointer bp-600:self-center bp-600:ml-6 transition-all hover:opacity-90 hover:scale-95 active:opacity-90 active:scale-95`,
    className,
    { expanded: isExpanded },
  )

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
        className={`inline-flex gap-2 font-normal items-center capitalize ${textColorVariable}`}
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
