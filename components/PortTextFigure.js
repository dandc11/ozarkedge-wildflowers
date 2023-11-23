import React from 'react'
import ResponsiveImage from './ResponsiveImage'
import cx from 'classnames'

// JSDoc definitions
/**
 * PortTextFigure component for use within Portable Text blocks - renders a figure with an image and caption. Accepts lightbox props for ResponsiveImage.
 * Created 07/01/23
 * @param {object} portTextProps - object with image and caption for figure
 * @param {string} lightboxIdentifier - identifier for lightbox.js
 * @param {function} lightboxCallback - function to toggle lightbox
 * @returns {JSX} - returns jsx of figure
 * @category Components
 * @example
 * <PortTextFigure
 * portTextProps={portTextProps}
 * lightboxIdentifier={lightboxIdentifier}
 * lightboxCallback={lightboxCallback}
 * />
 */
const PortTextFigure = ({
  portTextProps,
  lightboxIdentifier,
  lightboxCallback = null,
}) => {
  const widths = {
    '20%': 'w-full bp-600:w-[20%]',
    '25%': 'w-full bp-600:w-1/4',
    '33%': 'w-full bp-600:w-1/3',
    '50%': 'w-full bp-600:w-1/2',
    '66%': 'w-full bp-600:w-2/3',
    '75%': 'w-full bp-600:w-3/4',
    '100%': 'w-full',
  }

  const widthClass = portTextProps.value?.imageWidth
    ? widths[portTextProps.value?.imageWidth]
    : 'w-full bp-600:w-1/2'
  const positions = {
    left: `my-5 bp-600:float-left bp-600:mr-4 bp-600:my-0 ${
      portTextProps.value?.imageWidth
        ? widths[portTextProps.value?.imageWidth]
        : 'bp-600:w-[20%]'
    }`,
    right: `my-5 bp-600:float-right bp-600:ml-4 bp-600:my-0 ${
      portTextProps.value?.imageWidth
        ? widths[portTextProps.value?.imageWidth]
        : 'bp-600:w-[20%]'
    }`,
    center: `flex justify-center my-5`,
  }
  const positionClass = portTextProps.value?.imagePosition
    ? positions[portTextProps.value?.imagePosition]
    : positions['center']
  return (
    <>
      <ResponsiveImage
        image={portTextProps.value}
        priority={false}
        captionStyle={portTextProps.value?.captionPosition}
        showCaption={true}
        lightboxIdentifier={lightboxIdentifier}
        figureClassName={cx(
          `${
            portTextProps.value?.imagePosition !== 'left' &&
            portTextProps.value?.imagePosition !== 'right'
              ? widthClass
              : 'w-full'
          }`,
        )}
        width={560}
        wrapperClassName={cx(`port-text-img z-0 ${positionClass}`)}
        onClick={lightboxCallback ? lightboxCallback : null}
      />
    </>
  )
}

export default PortTextFigure
 