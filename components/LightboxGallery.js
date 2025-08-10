'use client'

import { useEffect, useMemo } from 'react'
import { SlideshowLightbox, initLightboxJS } from 'lightbox.js-react'
import cx from 'classnames'

import { urlForImage } from '../sanity/lib/sanity.image'
import useLightbox from '../hooks/useLightbox'

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
    const imgArray = Array.isArray(memoizedImages) ? memoizedImages : [memoizedImages]
    return imgArray.map((image) => ({
      src: urlForImage(image, { width: 100 }),
      original: urlForImage(image, { width: 1024, quality: 90 }),
      alt: image.alt,
      caption: showCaptions ? image.caption : '',
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedImages, showCaptions])

  return (
    <SlideshowLightbox
      className={cx({
        className,
      })}
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
    >
      {children}
    </SlideshowLightbox>
  )
}

export default LightboxGallery
