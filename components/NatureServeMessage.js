import React from 'react'
import { getNatureServeRankingColors } from '../utilities/helperUtil'
import cx from 'classnames'
import IconInfo from './IconInfo'

const NatureServeMessage = (props) => {
  const { conservationRanking } = props
  const { bgColorVariable, textColorVariable } =
    getNatureServeRankingColors(conservationRanking)
  return (
    <div className="relative inline-flex mb-4">
      <p
        style={{
          color: `var(${textColorVariable})`,
        }}
        className={cx(` gap-2 z-0 text-base bg-transparent rounded-md p-4`)}
        // style={{
        //   color: `var(${textColorVariable})`,
        // }}
      >
        <IconInfo
          className={' inline-block pr-2'}
          strokeColorVariable={textColorVariable}
          svgClassName={`inline mb-1`}
        />
        These classifications are based on the NatureServe Global Conservation
        Status Ranks. For more information on the rankings, visit
        <a
          className={`inline underline underline-offset-4 text-inherit`}
          style={{
            color: `var(${textColorVariable})`,
          }}
          href={
            'https://explorer.natureserve.org/AboutTheData/DataTypes/ConservationStatusCategories'
          }
          target="_blank"
        >
          {' '}NatureServe.
        </a>
        <div
          className="absolute w-full h-full -z-10 rounded-md top-0 left-0 "
          style={{
            backgroundColor: `var(${bgColorVariable})`,
            color: `var(${textColorVariable})`,
          }}
        ></div>
      </p>
    </div>
  )
}

export default NatureServeMessage
