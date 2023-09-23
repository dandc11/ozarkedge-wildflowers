import React from 'react'

import cx from 'classnames'
import { titleCase } from '../utilities/helperUtil'

const TopHeader = (headingLevel, children, classnames) => {
  return <></>
}

const PlantName = (props) => {
  const {
    plantName,
    headingLevel = 1,
    showBotanicalName = true,
    showCommonName = true,
    showSeparator = true,
    className,
    topNameClassName,
    bottomNameClassName,
  } = props
  const headingClassNames = cx(
    `common-name font-display font-semibold text-2xl pb-1 bp-600:pb-1 bp-700:text-3xl`,
    topNameClassName,
  )

  function getHeadingElement(headingLevel, headingClassNames, plantName) {
    switch (headingLevel) {
      case 1:
        return (
          <h1 className={headingClassNames}>
            {titleCase(plantName?.commonName)}
          </h1>
        )
      case 2:
        return (
          <h2 className={headingClassNames}>
            {titleCase(plantName?.commonName)}
          </h2>
        )
      case 3:
        return (
          <h3 className={headingClassNames}>
            {titleCase(plantName?.commonName)}
          </h3>
        )
      default:
        return null
    }
  }
  return (
    <div className={cx(`py-3 mx-0 inline text-center`, className)}>
      {showCommonName && (
        <>{getHeadingElement(headingLevel, headingClassNames, plantName)}</>
      )}

      {showSeparator && (
        <hr
          className={`w-full border-gray-800 border-solid border-t-[1px]`}
        ></hr>
      )}

      {showBotanicalName && (
        <h3
          className={cx(
            `botanical-name italic pt-1 font-normal text-base text-center bp-600:pt-1 bp-700:text-xl`,
            bottomNameClassName,
          )}
        >
          {titleCase(plantName?.botanicalName)}
        </h3>
      )}
    </div>
  )
}

export default PlantName
