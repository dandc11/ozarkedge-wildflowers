'use client'

import React, { useState } from 'react'
import cx from 'classnames'
import dynamic from 'next/dynamic'

import CustomLink from './CustomLink'
import ResponsiveImage from './ResponsiveImage'
import Button from './Button'

/**
 * ImageSlider Component - Displays a horizontal slider of images. If the images have links, they will be wrapped in a link. If the images have no links, they will open in a lightbox when clicked.
 * @category Components
 * @typedef {Object} ImageSliderProps
 * @property {string} captionBgClassName - The class name for the caption background
 * @property {string} className - The class name for the component
 * @property {boolean} useLightbox - Whether to use lightbox
 * @property {boolean} useLinks - Whether to use links
 * @property {string} lightboxIdentifier - The lightbox identifier
 * @property {boolean} showArrows - Whether to show arrows
 * @property {Array} sliderImages - The image slider images
 */
// Lazily load heavy, client-only pieces when needed
const DynamicLightboxGallery = dynamic(() => import('./LightboxGallery'), {
  ssr: false,
  loading: () => null,
})
const DynamicInteractiveImage = dynamic(() => import('./InteractiveImage'), {
  ssr: false,
  loading: () => null,
})

const ImageSlider = ({
  captionBgClassName,
  sliderImages,
  className = '',
  useLinks = false,
  lightboxIdentifier = '',
  showArrows = false,
} = {}) => {
  // local state for arrows is currently unused; keep placeholder if needed later
  const [isLightboxOpen, setIsLightboxOpen] = useState(false) // eslint-disable-line no-unused-vars
  const [startingSlideIndex, setStartingSlideIndex] = useState(0) // eslint-disable-line no-unused-vars

  const listItems = sliderImages?.map((image, index) => {
    return (
      <li key={index} className={`relative flex flex-col h-full`}>
        {useLinks && image.slug ? (
          // if the image has a link, wrap it in a link
          <CustomLink docType={image.docType} slug={image.slug}>
            <ResponsiveImage
              figureClassName={`img `}
              wrapperClassName={``}
              image={image}
              sizes="(max-width: 800px) 150px, 240px"
              placeholder={``}
              showCaption={true}
              loading="lazy"
              captionBgClassName={captionBgClassName}
            />
          </CustomLink>
        ) : (
          // if the image has no link, open it in the lightbox when clicked
          <DynamicInteractiveImage
            figureClassName={`img `}
            wrapperClassName={``}
            image={image}
            sizes="(max-width: 800px) 150px, 240px"
            lightboxIdentifier={lightboxIdentifier}
            placeholder={``}
            showCaption={true}
            loading="lazy"
            captionBgClassName={captionBgClassName}
          />
        )}
      </li>
    )
  })

  return (
    <>
      {!useLinks && Array.isArray(sliderImages) && sliderImages.length > 0 && (
        <DynamicLightboxGallery
          lightboxIdentifier={lightboxIdentifier}
          showSingleImage
          images={sliderImages}
          slideshow={true}
        />
      )}
      <div className={cx(`image-slider p-bk-xs p-in-md`, className)}>
        <ul className={`slider flex h-full`}>{listItems}</ul>
      </div>
    </>
  )
}

export default ImageSlider
