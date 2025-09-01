'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import cx from 'classnames'

import { LightboxContext } from '../contexts/LightboxContext'
import { getPathFromDocType } from '../utilities/helperUtil'

import ResponsiveImage from './ResponsiveImage'

const InteractiveImage = ({
  image,
  lightboxIdentifier,
  navigationSlug,
  navigationDocType,
  ...props
}) => {
  const { setLightBoxOpenImgKey, setLightboxIdentifier } = useContext(LightboxContext)
  const router = useRouter()
  const id = image?.asset?._ref || ''

  const handleClick = (e) => {
    if (lightboxIdentifier) {
      setLightBoxOpenImgKey(e.currentTarget.dataset.key)
      setLightboxIdentifier(lightboxIdentifier)
    }
  }

  const handleNavigationClick = (e) => {
    e.stopPropagation() // Prevent lightbox from opening
    if (navigationSlug && navigationDocType) {
      const href = getPathFromDocType(navigationDocType, navigationSlug)
      router.push(href)
    }
  }

  useEffect(() => {
    if (image && !(image.id || (image.asset && image.asset._ref))) {
      console.warn('Image without an id was used:', image)
    }
  }, [image])

  return (
    <div className="relative">
      <ResponsiveImage
        image={image}
        lightboxIdentifier={lightboxIdentifier}
        {...props}
        onClick={handleClick}
      />
      {navigationSlug && navigationDocType && (
        <button
          onClick={handleNavigationClick}
          className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 text-sm font-medium text-gray-800 hover:text-gray-900"
          title={`View ${navigationDocType} page`}
          aria-label={`Navigate to ${navigationSlug} page`}
        >
          →
        </button>
      )}
    </div>
  )
}

export default InteractiveImage
