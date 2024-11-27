import React from 'react'
import cx from 'classnames'

import { titleCase } from '../utilities/helperUtil'

const PlantName = (props) => {
  const {
    bottomNameClassName,
    className,
    headingLevel = 1,
    plantName,
    showBotanicalName = true,
    showCommonName = true,
    showSeparator = true,
    topNameClassName,
  } = props
  const headingClassNames = cx(`common-name font-display`, topNameClassName)

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
    <div className={cx(`plant-name-wrapper`, className)}>
      {showCommonName && (
        <>{getHeadingElement(headingLevel, headingClassNames, plantName)}</>
      )}

      {showSeparator && <hr className={`h-rule w-full`}></hr>}

      {showBotanicalName && (
        <h3 className={cx(`botanical-name`, bottomNameClassName)}>
          {titleCase(plantName?.botanicalName)}
        </h3>
      )}
    </div>
  )
}

export default PlantName
