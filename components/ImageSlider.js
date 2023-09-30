import React, { createContext } from 'react'
import Link from 'next/link'
import ResponsiveImage from './ResponsiveImage'
import { getPathFromDocType } from '../utilities/helperUtil'
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
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  const listItems = sliderImages?.map((image, index) => {
    return (
      <li key={index} className={`relative flex flex-col h-full snap-center`}>
        {useLinks ? (
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
        )}
      </li>
    )
  })

  return (
    <div
      className={cx(
        `relative overflow-x-auto snap-x snap-mandatory w-full pt-2 hide-scroll`,
        className,
      )}
    >
      <ul className={`flex flex-nowrap gap-3 h-full`}>{listItems}</ul>
    </div>
  )
}

export default ImageSlider
