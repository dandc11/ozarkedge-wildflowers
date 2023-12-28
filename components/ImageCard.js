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
  imagePosition,
  plantName,
}) => {
  console.log('image', image)
  const imageComponent = (
    <div className="aspect-w-4 aspect-h-4 w-24">
      <ResponsiveImage
        image={image}
        alt={titleText}
        showCaption={false}
        className="hover:scale-100 rounded-none object-cover aspect-3/4"
      />
    </div>
  )

  const containerClasses = cx(
    'image-card shadow-md rounded-md overflow-clip',
    className,
  )

  const getMonthNames = () => {
    const monthNames = floweringMonths.map((monthIndex) =>
      MONTH_NAMES_MAP.get(monthIndex),
    )
    return monthNames.join(', ')
  }

  return (
    <div className={containerClasses}>
      {imagePosition !== 'right' && imageComponent}
      <div className="text-container text-left flex flex-wrap">
        {/* <h2 className='text-base font-display mb-2'>{titleText}</h2> */}
        <PlantName
          className="text-base font-display mb-2"
          topNameClassName="text-base font-display text-left bp-700:text-base"
          plantName={plantName}
          headingLevel={3}
          showBotanicalName={false}
          showSeparator={false}
        />
        <p className="text-sm font-body">
          <span className="uppercase text-xs">flowering months: </span>{' '}
          <br></br>
          {getMonthNames()}
        </p>
      </div>
      {imagePosition === 'right' && imageComponent}
    </div>
  )
}

export default ImageCard
