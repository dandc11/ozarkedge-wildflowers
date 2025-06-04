import React from 'react'
import cx from 'classnames'

/**
 *
 * @param {Object} props - The props object.
 * @param {string} [props.className=''] - Additional class names to apply to the skeleton card.
 * @return {JSX.Element}
 * @description
 * This component renders a skeleton card for plant images, mimicking the structure of the PlantImageCard component.
 */
const PlantCardSkeleton = ({ className = '' }) => {
  return (
    <div className={cx('img-card skeleton-card', className)}>
      {/* Image skeleton - matches img-card-img */}
      <div className="img-card-img">
        <div className="skeleton-shimmer skeleton-image"></div>
      </div>

      {/* Content skeleton - matches img-card-description */}
      <div className="img-card-description">
        <div className="img-card-heading">
          {/* Plant name wrapper skeleton */}
          <div className="plant-name-wrapper">
            {/* Common name skeleton */}
            <div className="skeleton-shimmer skeleton-common-name mb-xs"></div>
            {/* Botanical name skeleton */}
            <div className="skeleton-shimmer skeleton-botanical-name"></div>
          </div>
        </div>

        {/* Body content skeleton - matches img-card-body */}
        <div className="img-card-body mt-sm">
          {/* Flowering period and habitat skeleton */}
          <div className="flex flex-wrap">
            <div className="skeleton-shimmer skeleton-details mb-xs"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantCardSkeleton
