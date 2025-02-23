import React from 'react'
import cx from 'classnames'

import ResponsiveImage from './ResponsiveImage'

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
const PortTextFigure = ({ portTextProps, lightboxIdentifier, lightboxCallback = null }) => {
  const widths = {
    '20%': 'w-full w-20',
    '25%': 'w-full w-25',
    '33%': 'w-full w-33',
    '50%': 'w-full w-50',
    '66%': 'w-full w-66',
    '75%': 'w-full w-75',
    '100%': 'w-full',
  }

  const widthClass = portTextProps.value?.imageWidth
    ? widths[portTextProps.value?.imageWidth]
    : 'w-full w-66'
  const positions = {
    left: `my-7 float-left ${
      portTextProps.value?.imageWidth ? widths[portTextProps.value?.imageWidth] : 'w-20'
    }`,
    right: `my-7 float-right ${
      portTextProps.value?.imageWidth ? widths[portTextProps.value?.imageWidth] : 'w-20'
    }`,
    center: `flex justify-center m-bk-lg`,
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
        wrapperClassName={cx(`port-text-img ${positionClass}`)}
        onClick={lightboxCallback ? lightboxCallback : null}
      />
    </>
  )
}

export default PortTextFigure
