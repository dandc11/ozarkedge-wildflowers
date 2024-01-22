import React from 'react'
import ResponsiveImage from './ResponsiveImage'
import PortTextWrapper from './PortTextWrapper'
import PlantName from './PlantName'
import { MONTH_NAMES_MAP } from '../utilities/constants'
import cx from 'classnames'

const ImageCard = ({
  className = '',
  image,
  titleText,
  flowerColor,
  floweringMonths,
  habitatType,
  imagePosition,
  plantName,
}) => {
  console.log('image', image)
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
    'image-card shadow-md rounded-md overflow-clip hover:scale-105 transform transition-all duration-300 ease-in-out ',
    className,
  )

  const getMonthNames = () => {
    const monthNames = floweringMonths.map((monthIndex) =>
      MONTH_NAMES_MAP.get(monthIndex).abbreviation,
    )
    return monthNames.join(', ')
  }

  return (
    <div className={containerClasses}>
      {imagePosition !== 'right' && imageComponent}
      <div className="text-container text-left flex flex-col justify-between ml-2">
        {/* <h2 className='text-base font-display mb-2'>{titleText}</h2> */}
        <PlantName
          className="text-base font-display py-1"
          topNameClassName="text-base font-display text-left bp-700:text-base"
          plantName={plantName}
          headingLevel={3}
          showBotanicalName={false}
          showSeparator={false}
        />
        <div className="flex flex-wrap">

        <p className="text-sm font-body">
          <span className="uppercase text-xs">flowering months: </span>{' '}
          {getMonthNames()}
        </p>
        <p className="text-sm font-body">
          <span className="uppercase text-xs">habitat: </span>{' '}
          {habitatType}
        </p>
        </div>
      </div>
      {imagePosition === 'right' && imageComponent}
    </div>
  )
}

export default ImageCard
