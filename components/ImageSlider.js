import React, { createContext } from 'react'
import Link from 'next/link'
import ResponsiveImage from './ResponsiveImage'
import { getPathFromDocType } from '../utilities/helperUtil'
import cx from 'classnames'

/**
 * ImageSlider - component to render a horizontal slider of images
 * @param {string} captionBgClassName - background color for caption
 * @param {array} sliderItems - array of objects containing a image, link and documentType (optional)
 * @param {boolean} useLightbox - whether or not to use lightbox.js
 * @param {boolean} useLinks - whether or not to use links
 * @param {string} lightboxIdentifier - identifier for lightbox.js
 * @returns {JSX.Element}
 * @created 04-06-2023
 * @lastUpdated 04-06-2023
 */

const ImageSlider = (props) => {
  const {
    captionBgClassName,
    sliderItems,
    className = '',
    useLightbox = false,
    useLinks = false,
    lightboxIdentifier = '',
  } = props

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  const listItems = sliderItems?.map((item, index) => {
    return (
      <li key={index} className={`relative flex flex-col h-full snap-center`}>
        {useLinks ? (
          <Link href={`${getPathFromDocType(item.docType, item.slug)}`}>
            <ResponsiveImage
              className={`w-full h-auto rounded-md aspect-[3/4] object-cover`}
              figureClassName={`img w-36 relative mb-5 bp-800:w-[15rem] bp-800:h-auto`}
              wrapperClassName={``}
              image={item.image}
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
            className={`w-full h-auto `}
            figureClassName={`img w-36 relative mb-5 rounded-md bp-800:w-[15rem] bp-800:h-auto`}
            wrapperClassName={``}
            image={item.image}
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
