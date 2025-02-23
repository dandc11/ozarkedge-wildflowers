'use client'

import { useEffect, useMemo } from 'react'
import { SlideshowLightbox, initLightboxJS } from 'lightbox.js-react'
import cx from 'classnames'
import imageUrlBuilder from '@sanity/image-url'

import { client } from '../sanity/lib/sanity.client'
import useLightbox from '../hooks/useLightbox'

const LightboxGallery = ({
  children,
  className = '',
  cols = 3,
  images = undefined,
  lightboxIdentifier,
  lightboxImgClass,
  onOpenCallback,
  onCloseCallback = () => {},
  showImageGrid = false,
  showCaptions = true,
  showThumbnails = true,
  useNextImage = false,
}) => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY) {
      initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY, 'individual')
    }
  }, [])

  const urlBuilder = imageUrlBuilder(client)
  const urlFor = (source) => urlBuilder.image(source)

  const memoizedImages = useMemo(() => images, [images])

  const { open, startingSlideIndex, closeLightboxCallback } = useLightbox(
    memoizedImages,
    onOpenCallback,
    onCloseCallback,
    lightboxIdentifier,
  )

  const gridColumns = useMemo(
    () => ({
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    }),
    [],
  )

  const imgObjArray = useMemo(() => {
    if (!memoizedImages) return null
    const imgArray = Array.isArray(memoizedImages) ? memoizedImages : [memoizedImages]
    return imgArray.map((image) => ({
      src: urlFor(image.asset).width(100).url(),
      original: urlFor(image.asset).fit('max').width(1024).format('webp').url(),
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
