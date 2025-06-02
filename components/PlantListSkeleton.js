import React from 'react'
import cx from 'classnames'

/**
 * PlantCardSkeleton - Individual skeleton card that matches PlantImageCard dimensions
 */
const PlantCardSkeleton = ({ className = '' }) => {
  return (
    <div className={cx('img-card skeleton-card', className)}>
      {/* Image skeleton */}
      <div className="img-card-img">
        <div className="skeleton-shimmer skeleton-image"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="img-card-description">
        <div className="img-card-heading">
          {/* Plant name skeletons */}
          <div className="plant-name-wrapper">
            <div className="skeleton-shimmer skeleton-common-name mb-xs"></div>
            <div className="skeleton-shimmer skeleton-botanical-name"></div>
          </div>
        </div>
        
        {/* Details skeleton */}
        <div className="img-card-body mt-sm">
          <div className="skeleton-shimmer skeleton-details mb-xs"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * PlantListSkeleton - Full grid skeleton that shows expected layout
 */
const PlantListSkeleton = ({ count = 12, showFilters = true }) => {
  return (
    <div className="plant-list-layout-wrapper relative">
      {/* Info section skeleton */}
      <section className="info-section w-full">
        {/* Description skeleton */}
        <div className="description w-full">
          <div className="skeleton-shimmer skeleton-text-line mb-sm w-full"></div>
          <div className="skeleton-shimmer skeleton-text-line mb-sm skeleton-text-75"></div>
          <div className="skeleton-shimmer skeleton-text-line mb-lg skeleton-text-50"></div>
        </div>
        
        {/* Filters skeleton */}
        {showFilters && (
          <div className="plant-list-fieldset w-full skeleton-fieldset rounded-md p-lg mb-xl">
            <div className="skeleton-shimmer skeleton-legend mb-lg"></div>
            <div className="skeleton-filters-grid">
              <div className="skeleton-shimmer skeleton-filter-input"></div>
              <div className="skeleton-shimmer skeleton-filter-input"></div>
              <div className="skeleton-shimmer skeleton-filter-input"></div>
              <div className="skeleton-shimmer skeleton-filter-input"></div>
            </div>
          </div>
        )}
      </section>
      
      {/* Plant grid skeleton */}
      <section className="plant-list-container w-full">
        <div className="plant-card-grid w-full">
          {Array.from({ length: count }, (_, index) => (
            <PlantCardSkeleton key={index} className="skeleton-pulse" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PlantListSkeleton