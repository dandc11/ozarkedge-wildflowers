import React from 'react'
import ResponsiveImage from './ResponsiveImage'
import PlantName from './PlantName'
import { MONTH_NAMES_MAP } from '../utilities/constants'
import cx from 'classnames'

const PlantImageCard = ({
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
    <div className="aspect-w-4 aspect-h-4 w-28">
      <ResponsiveImage
        image={image}
        alt={titleText}
        disableHover={true}
        showCaption={false}
        className="rounded-none object-cover aspect-3/4"
      />
    </div>
  )

  const containerClasses = cx(
    'img-card shadow-md rounded-md overflow-clip hover:scale-105 transform transition-all duration-300 ease-in-out ',
    className,
  )

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
      <div className="text-container flex flex-col justify-between">
        {/* <h2 className='text-base font-display mb-2'>{titleText}</h2> */}
        <PlantName
          className="img-card-name text-base font-display py-1"
          topNameClassName="text-base font-display pb-1 text-left bp-700:text-base"
          plantName={plantName}
          headingLevel={3}
          showBotanicalName={true}
          showSeparator={true}
        />
        <div className="flex flex-wrap">
          <p className="plant-data text-sm font-body">
            <span className="flowering uppercase text-xs">
              {' '}
              {floweringMonths && getMonthNames()}{' '}
            </span>{' '}
            |{' '}
            <span className="uppercase text-xs">
              {' '}
              {Array.isArray(habitatType)
                ? habitatType.join(', ')
                : habitatType}{' '}
            </span>
          </p>
        </div>
      </div>
      {imagePosition === 'right' && imageComponent}
    </div>
  )
}

export default PlantImageCard
