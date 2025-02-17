'use client'
import React from 'react'
import cx from 'classnames'

import ResponsiveImage from './ResponsiveImage'

const ThumbnailGrid = (props) => {
  const {
    assets = [],
    className,
    cols = 3,
    maxItems = 12,
    thumbnailWidth = 100,
    lightboxIdentifier = '',
    onClick,
    showCaptions = false,
  } = props
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  // call onClick callback with key of image clicked
  const handleClick = (e) => {
    if (onClick) {
      onClick(e.currentTarget.dataset.key)
    }
  }
  let galleryImages = []
  galleryImages = assets.map((image, index) => {
    const key = image.asset?._ref || index
    return (
      <li
        key={key}
        data-key={key}
        className={cx({ hidden: index + 1 > maxItems }, 'rounded-md')}
        onClick={handleClick}
      >
        <ResponsiveImage
          className="thumbnail cover"
          // disableHover
          figureClassName=""
          image={image}
          lightboxIdentifier={lightboxIdentifier}
          mobileImage={false}
          showCaption={showCaptions}
          width="560"
        />
      </li>
    )
  })

  return (
    <ul className={cx(`img-grid grid ${gridColumns[cols]} gap-3`, className)}>{galleryImages}</ul>
  )
}

export default ThumbnailGrid
