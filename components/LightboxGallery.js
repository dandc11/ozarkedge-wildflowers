'use client'

import { useEffect, useMemo } from 'react'
import { SlideshowLightbox, initLightboxJS } from 'lightbox.js-react'
import cx from 'classnames'

import { urlForImage } from '../sanity/lib/sanity.image'
import useLightbox from '../hooks/useLightbox'

/**
 * A lightbox gallery component for displaying images in a modal slideshow
 * @param {ReactNode} children - Child elements to render within the lightbox
 * @param {string} className - Additional CSS classes for the lightbox
 * @param {Array|Object} images - Sanity image objects to display
 * @param {string} lightboxIdentifier - Unique identifier for this lightbox instance
 * @param {Function} onOpenCallback - Function called when lightbox opens
 * @param {Function} onCloseCallback - Function called when lightbox closes
 * @param {boolean} showCaptions - Whether to display image captions
 * @param {boolean} showThumbnails - Whether to display thumbnail navigation
 */
const LightboxGallery = ({
  children,
  className = '',
  images = undefined,
  lightboxIdentifier,
  onOpenCallback,
  onCloseCallback = () => {},
  showCaptions = true,
  showThumbnails = true,
}) => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY) {
      initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY, 'individual')
    }
  }, [])
  const memoizedImages = useMemo(() => images, [images])

  const { open, startingSlideIndex, closeLightboxCallback } = useLightbox(
    memoizedImages,
    onOpenCallback,
    onCloseCallback,
    lightboxIdentifier,
  )
  const imgObjArray = useMemo(() => {
    if (!memoizedImages) return null

    try {
      const imgArray = Array.isArray(memoizedImages) ? memoizedImages : [memoizedImages]
      return imgArray.map((image) => {
        // Create a properly formatted thumbnail URL with absolute dimensions
        const thumbUrl = urlForImage(image, {
          width: 150,
          height: 150,
          fit: 'crop',
          quality: 70,
          auto: 'format',
        }).url()

        // Create a properly formatted original URL
        const originalUrl = urlForImage(image, {
          width: 1024,
          quality: 90,
          auto: 'format',
        }).url()

        return {
          src: thumbUrl,
          original: originalUrl,
          alt: image.alt || '',
          caption: showCaptions ? image.caption || '' : '',
          width: 150,
          height: 150,
          blurDataURL: image.lqip || undefined,
          placeholder: image.lqip ? 'blur' : 'empty',
        }
      })
    } catch (error) {
      console.error('Error processing images for lightbox:', error)
      return []
    }
  }, [memoizedImages, showCaptions])

  return (
    <SlideshowLightbox
      className={className || ''}
      framework={'next'}
      iconColor="white"
      images={imgObjArray}
      imgAnimation="fade"
      leftArrowClassname={'lightbox-arrow'}
      lightboxIdentifier={lightboxIdentifier}
      lightboxImgClass={'lightbox-img'}
      modalClose="clickOutside"
      onClose={closeLightboxCallback}
      open={open}
      rightArrowClassname={'lightbox-arrow'}
      showControls={true}
      showThumbnails={showThumbnails}
      slideshowInterval={3500}
      startingSlideIndex={startingSlideIndex}
      theme="lightbox"
      thumbnailBorder="silver"
      thumbnailClassName="lightbox-thumbnail"
      thumbnailHeight={150}
      thumbnailWidth={150}
    >
      {children}
    </SlideshowLightbox>
  )
}

export default LightboxGallery
