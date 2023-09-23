import { useEffect } from 'react'
import { SlideshowLightbox, initLightboxJS } from 'lightbox.js-react'
import cx from 'classnames'
import ResponsiveImage from './ResponsiveImage'
import imageUrlBuilder from '@sanity/image-url'
import { getClient } from '../lib/sanity.client'
import Image from 'next/image'

/**
 *  Uses lightbox.js-react to display a lightbox slideshow. Accepts an array of images to display in the lightbox. Current preferred usage is to open and close the lightbox using the open prop and to display images separately using the ResponsiveImage component rather than including images in the children prop.
 * @param {object} children - Children to display in the lightbox.
 * @param {string} className - Classes applied to the image grid.
 * @param {number} cols - Number of columns to display in the image grid.
 * @param {array} images - Array of images to be featured in the open lightbox.
 * @param {string} lightboxIdentifier - Identifier for the lightbox.
 * @param {string} lightboxImgClass - Class applied to the lightbox images.
 * @param {number} maxItems - Maximum number of items to display in the lightbox. TODO: Implement this.
 * @param {boolean} open - Opens the lightbox when true.
 * @param {function} onOpenCallback - Callback function to run when the lightbox is opened.
 * @param {function} onCloseCallback - Callback function to run when the lightbox is closed.
 * @param {boolean} showImageGrid - Whether to show the image grid or not.
 * @param {number} startingSlideIndex - Index of the slide to start on.
 * @param {number} thumbnailWidth - Width of the thumbnails.
 * @returns {JSX.Element} - Lightbox component. Displays a lightbox slideshow. Can display a grid of images.
 */
const LightboxGallery = ({
  children,
  className,
  cols = 3,
  draftMode,
  hideGrid = false,
  images,
  lightboxIdentifier,
  lightboxImgClass,
  maxItems,
  open = false,
  onOpenCallback,
  onCloseCallback,
  showImageGrid = true,
  startingSlideIndex = 0,
  thumbnailWidth = 200,
}) => {
  // initialize lightbox.js
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY) {
      initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY, 'individual')
    }
  }, [])
  const client = getClient()
  const urlBuilder = imageUrlBuilder(client)
  const urlFor = (source) => urlBuilder.image(source)

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }
  const imageObjArray = images.map((image, index) => {
    return {
      src: urlFor(image.asset).width(100).url(),
      original: urlFor(image.asset).fit('max').width(2000).url(),
      alt: image.alt,
    }
  })

  return (
    <SlideshowLightbox
      className={cx({
        [`grid ${gridColumns[cols]} place-items-center gap-2`]: showImageGrid,
        className,
      })}
      framework="next"
      fullScreen={true}
      iconColor="white"
      images={imageObjArray}
      imgAnimation="fade"
      leftArrowClassname={'text-white text-2xl'}
      lightboxIdentifier={lightboxIdentifier}
      lightboxImgClass={lightboxImgClass}
      modalClose="clickOutside"
      onClose={onCloseCallback ? onCloseCallback : () => {}}
      open={open}
      rightArrowClassname={'text-white text-2xl'}
      showControls={true}
      slideshowInterval={3500}
      startingSlideIndex={startingSlideIndex}
      theme="lightbox"
      thumbnailBorder="silver"
    ></SlideshowLightbox>
  )
}

export default LightboxGallery
