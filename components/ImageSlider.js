import React, { createContext, useState } from 'react'
import Link from 'next/link'
import ResponsiveImage from './ResponsiveImage'
import { getPathFromDocType } from '../utilities/helperUtil'
import LightboxGallery from 'components/LightboxGallery'
import cx from 'classnames'

// JS Doc for ImageSlider
/**
 * @typedef {Object} ImageSliderProps
 * @property {string} captionBgClassName - The class name for the caption background
 * @property {string} className - The class name for the component
 * @property {boolean} useLightbox - Whether to use lightbox
 * @property {boolean} useLinks - Whether to use links
 * @property {string} lightboxIdentifier - The lightbox identifier
 * @property {Array} sliderImages - The image slider images
 */
const ImageSlider = ({
  captionBgClassName,
  sliderImages,
  className = '',
  useLightbox = false,
  useLinks = false,
  lightboxIdentifier = '',
} = props) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [startingSlideIndex, setStartingSlideIndex] = useState(0)
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  // toggle lightbox, set starting slide index if opening
  const toggleLightbox = (key) => {
    if (key) {
      const index = sliderImages.findIndex((e) => e.asset._ref === key)
      console.log('slider images', sliderImages)
      console.log('starting index found ', index)
      setStartingSlideIndex(index)
    }
    setIsLightboxOpen(!isLightboxOpen)
  }
  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const listItems = sliderImages?.map((image, index) => {
    return (
      <li key={index} className={`relative flex flex-col h-full snap-center`}>
        {useLinks && image.link !== null ? (
          // if the image has a link, wrap it in a link
          <Link href={`${getPathFromDocType(image.docType, image.link)}`}>
            <ResponsiveImage
              className={`w-full h-auto rounded-md aspect-[3/4] object-cover`}
              figureClassName={`img w-36 relative mb-5 bp-800:w-[15rem] bp-800:h-auto`}
              wrapperClassName={``}
              image={image}
              sizes="(max-width: 800px) 150px, 240px"
              mobileWidth
              priority={false}
              placeholder={``}
              showCaption={true}
              captionBgClassName={captionBgClassName}
            />
          </Link>
        ) : (
          // if the image has no link, open it in the lightbox when clicked
          <ResponsiveImage
            className={`w-full h-auto rounded-md aspect-[3/4] object-cover`}
            figureClassName={`img w-36 relative mb-5 bp-800:w-[15rem] bp-800:h-auto`}
            wrapperClassName={``}
            image={image}
            sizes="(max-width: 800px) 150px, 240px"
            lightboxIdentifier={lightboxIdentifier}
            mobileWidth
            priority={false}
            placeholder={``}
            showCaption={true}
            onClick={toggleLightbox ? toggleLightbox : null}
            captionBgClassName={captionBgClassName}
          />
        )}
      </li>
    )
  })

  return (
    <div
      className={cx(
        `relative overflow-x-auto snap-x snap-mandatory w-full pt-2 hide-scroll max-h-fit`,
        className,
      )}
    >
      <LightboxGallery
        className={`px-4`}
        lightboxImgClass={`h-[80vh]`}
        lightboxIdentifier={lightboxIdentifier}
        showImageGrid={false}
        showSingleImage
        images={sliderImages}
        slideshow={true}
        startingSlideIndex={startingSlideIndex}
        onCloseCallback={closeLightbox}
        open={isLightboxOpen}
      ></LightboxGallery>
      <ul className={`flex flex-nowrap gap-3 h-full`}>{listItems}</ul>
    </div>
  )
}

export default ImageSlider
