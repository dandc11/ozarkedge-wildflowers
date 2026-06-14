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
  const headingClassNames = cx(`common-name text-display`, topNameClassName)

  function getHeadingElement(headingLevel, headingClassNames, plantName) {
    // Use first array item for display (primary name)
    const commonName = Array.isArray(plantName?.commonName)
      ? plantName.commonName[0]
      : plantName?.commonName

    switch (headingLevel) {
      case 1:
        return <h1 className={headingClassNames}>{titleCase(commonName)}</h1>
      case 2:
        return <h2 className={headingClassNames}>{titleCase(commonName)}</h2>
      case 3:
        return <h3 className={headingClassNames}>{titleCase(commonName)}</h3>
      default:
        return null
    }
  }
  const BotanicalHeading = `h${Math.min(headingLevel + 1, 6)}`

  return (
    <div className={cx(`plant-name-wrapper `, className)}>
      {showCommonName && <>{getHeadingElement(headingLevel, headingClassNames, plantName)}</>}

      {showSeparator && <hr className={`h-rule w-full`}></hr>}

      {showBotanicalName && (
        <BotanicalHeading className={cx(`botanical-name`, bottomNameClassName)}>
          {titleCase(
            Array.isArray(plantName?.botanicalName)
              ? plantName.botanicalName[0]
              : plantName?.botanicalName,
          )}
        </BotanicalHeading>
      )}
    </div>
  )
}

export default PlantName
