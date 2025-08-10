import React from 'react'
import cx from 'classnames'

import ResponsiveImage from './ResponsiveImage'
import PlantName from './PlantName'
import { MONTH_NAMES_MAP } from '../utilities/constants'

const PlantImageCard = React.memo(
  ({
    className = '',
    image,
    titleText,
    flowerColor,
    floweringMonths = [],
    habitatType,
    imagePosition,
    plantName,
  }) => {
    const imageComponent = (
      <div className="img-card-img">
        <ResponsiveImage
          alt={titleText}
          disableHover={true}
          figureClassName="w-full h-full"
          image={image}
          showCaption={false}
          height={200}
          width={150}
        />
      </div>
    )

    const containerClasses = cx('img-card ', className)

    const getMonthNames = () => {
      const monthNames = floweringMonths.map(
        (monthIndex) => MONTH_NAMES_MAP.get(monthIndex).abbreviation,
      )
      if (monthNames.length > 2) {
        return `${monthNames[0]}—${monthNames[monthNames.length - 1]}`
      } else {
        return monthNames.join(', ')
      }
    }

    return (
      <div className={containerClasses}>
        {imagePosition !== 'right' && imageComponent}
        <div className="img-card-description">
          {/* <h2 className='text-base text-display mb-xs'>{titleText}</h2> */}
          <PlantName
            className="img-card-heading text-display"
            topNameClassName="text-display text-left "
            bottomNameClassName="text-left fs-xs"
            plantName={plantName}
            headingLevel={3}
            showBotanicalName={true}
            showSeparator={true}
          />
          <div className="flex flex-wrap">
            <p className="img-card-body fs-xs font-body">
              <span className="flowering uppercase font-xxs">
                {' '}
                {floweringMonths && getMonthNames()}{' '}
              </span>{' '}
              |{' '}
              <span className="uppercase font-xxs">
                {' '}
                {Array.isArray(habitatType) ? habitatType.join(', ') : habitatType}{' '}
              </span>
            </p>
          </div>
        </div>
        {imagePosition === 'right' && imageComponent}
      </div>
    )
  },
)

export default PlantImageCard
