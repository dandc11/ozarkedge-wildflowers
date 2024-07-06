import React, { useState } from 'react'
import CustomLink from './CustomLink'
import ResponsiveImage from './ResponsiveImage'
import Button from './Button'
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
 * @property {boolean} showArrows - Whether to show arrows
 * @property {Array} sliderImages - The image slider images
 */
const ImageSlider = ({
  captionBgClassName,
  sliderImages,
  className = '',
  useLightbox = false,
  useLinks = false,
  lightboxIdentifier = '',
  showArrows = false,
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
      setStartingSlideIndex(index)
    }
    setIsLightboxOpen(!isLightboxOpen)
  }
  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const listItems = sliderImages?.map((image, index) => {
    return (
      <li
        key={index}
        className={`relative flex-none flex flex-col h-full snap-center`}
      >
        {useLinks && image.slug ? (
          // if the image has a link, wrap it in a link
          <CustomLink docType={image.docType}  slug={image.slug}>
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
          </CustomLink>
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
    <>
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
      />
      <div
        className={cx(`image-slider relative w-full pt-2 max-h-fit`, className)}
      >
        {/* {showArrows && (
        <Button
          className={`absolute top-[33%] left-0 z-10`}
          buttonIcon="chevron-left"
          callBack={() => {
            console.log('left')
          }}
        />
      )} */}
        <ul
          className={`slider overflow-x-auto snap-x snap-mandatory flex flex-nowrap gap-3 h-full`}
        >
          {listItems}
        </ul>
        {/* {showArrows && (
        <Button
          className={`absolute top-[50%] right-0 z-10`}
          buttonIcon="chevron-right"
          callBack={() => {
            console.log('right')
          }}
        />
      )} */}
      </div>
    </>
  )
}

export default ImageSlider
