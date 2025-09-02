import React from 'react'
import cx from 'classnames'

import { IMG_SIZES } from '../utilities/constants'

import InteractiveImage from './InteractiveImage'

const ThumbnailGrid = (props) => {
  const {
    assets = [],
    className,
    cols = 3,
    maxItems = 12,
    thumbnailWidth = 100,
    lightboxIdentifier = '',
    showCaptions = false,
  } = props
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  let galleryImages = []
  galleryImages = assets.map((image, index) => {
    const key = image.asset?._ref || index
    return (
      <li key={key} data-key={key} className={cx({ hidden: index + 1 > maxItems }, 'rounded-md')}>
        <InteractiveImage
          className="thumbnail cover"
          // disableHover
          figureClassName="w-full"
          image={image}
          lightboxIdentifier={lightboxIdentifier}
          showCaption={showCaptions}
          width="430"
          sizes={IMG_SIZES.THUMBNAIL_GRID_SIZES}
        />
      </li>
    )
  })

  return (
    <div
      className={cx(`img-grid grid ${gridColumns[cols]} gap-3`, className)}
      data-sanity-edit-target
    >
      {galleryImages}
    </div>
  )
}

export default ThumbnailGrid
