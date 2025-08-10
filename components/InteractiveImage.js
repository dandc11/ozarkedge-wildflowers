'use client'

import { useContext, useEffect } from 'react'
import cx from 'classnames'

import { LightboxContext } from '../contexts/LightboxContext'
import ResponsiveImage from './ResponsiveImage'

const InteractiveImage = ({ image, lightboxIdentifier, ...props }) => {
  const { setLightBoxOpenImgKey, setLightboxIdentifier } = useContext(LightboxContext)
  const id = image?.asset?._ref || ''

  const handleClick = (e) => {
    if (lightboxIdentifier) {
      setLightBoxOpenImgKey(e.currentTarget.dataset.key)
      setLightboxIdentifier(lightboxIdentifier)
    }
  }

  useEffect(() => {
    if (image && !(image.id || (image.asset && image.asset._ref))) {
      console.warn('Image without an id was used:', image)
    }
  }, [image])

  return (
    <ResponsiveImage
      image={image}
      lightboxIdentifier={lightboxIdentifier}
      {...props}
      onClick={handleClick}
    />
  )
}

export default InteractiveImage
