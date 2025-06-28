'use client'

import { PortableText } from '@portabletext/react'
import cx from 'classnames'
import Link from 'next/link'
import React, { useMemo } from 'react'

import { getPathFromDocType } from '../utilities/helperUtil'
import PortTextFigure from './PortTextFigure'
import PortTextVideo from './PortTextVideo'
import PortTextTeaser from './PortTextTeaser'
import ThumbnailGrid from './ThumbnailGrid'

const portTextComponents = {
  block: {
    // customizing common block types
    h2: ({ children }) => <h2 className="w-full fs-2xl">{children}</h2>,
    h3: ({ children }) => <h3 className="w-full fs-xl">{children}</h3>,
    h4: ({ children }) => <h4 className="w-full fs-lg">{children}</h4>,
    normal: ({ children }) => <p className="w-full text-inherit">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-purple-500">{children}</blockquote>
    ),
  },
  types: {},
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ul className={`mt-xs`}>{children}</ul>,
    number: ({ children }) => <ol className={`mt-xs list-decimal`}>{children}</ol>,
  },
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <li className={`list-item list-inside`} style={{ listStyleType: ' disclosure-closed' }}>
        {children}
      </li>
    ),
    number: ({ children }) => <li className={`list-item list-inside`}>{children}</li>,
  },
  marks: {
    internalLink: ({ children, value }) => {
      const href = getPathFromDocType(value?.docType, value?.slug?.current)
      return (
        <Link className={`underline `} href={href}>
          {children}
        </Link>
      )
    },
    externalLink: ({ children, value }) => {
      const href = value?.href || ''
      return (
        <a
          className={`underline`}
          href={href}
          target={value?.blank ? 'blank' : ''}
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    },
  },
}
/**
 * A memoized React component that wraps PortableText and provides a callback for opening a lightbox.
 *
 * @param {Object} props - The props object.
 * @param {string} props.className - The class name for the component.
 * @param {Object} props.value - The PortableText value object.
 * @param {Function} props.lightboxCallback - The callback function for opening a lightbox.
 * @param {string} props.lightboxIdentifier - The identifier for the lightbox.
 * @param {string} props.documentId - The ID of the Sanity document.
 * @param {string} props.documentType - The type of the Sanity document.
 * @param {string} props.portableTextPath - The path to the portable text field within the document.
 * @returns {JSX.Element} - The rendered component.
 */
const PortTextWrapper = React.memo((props) => {
  const {
    className,
    value,
    lightboxIdentifier,
    lightboxCallback = () => {},
    documentId = '', // Added prop
    documentType = '', // Added prop
    portableTextPath, // Added prop
  } = props
  // callback for opening lightbox
  const componentsWithCallback = useMemo(
    function memoedCallback() {
      const { figure, ...otherComponents } = portTextComponents

      return {
        ...otherComponents,
        types: {
          ...portTextComponents.types,
          figure: (typeProps) => {
            return (
              <PortTextFigure
                portTextProps={typeProps}
                lightboxIdentifier={lightboxIdentifier}
                lightboxCallback={lightboxCallback}
              />
            )
          },
          imageCollection: (typeProps) => (
            <ThumbnailGrid
              assets={typeProps.value?.imageCollection}
              className={`img-collection`}
              cols={2}
              maxItems={12}
              lightboxIdentifier={lightboxIdentifier}
              onClick={lightboxCallback}
              showCaptions
            />
          ),
          portTextVideo: (typeProps) => {
            return <PortTextVideo portTextProps={typeProps} />
          },
          teaserSection: (typeProps) => {
            return <PortTextTeaser portTextProps={typeProps?.value} />
          },
        },
      }
    },
    [lightboxCallback, lightboxIdentifier], // Add new props to dependency array
  )

  return (
    <div className={cx(`port-text`, className)}>
      <PortableText value={value} components={componentsWithCallback} />
    </div>
  )
})

PortTextWrapper.displayName = 'PortTextWrapper'

export default PortTextWrapper
