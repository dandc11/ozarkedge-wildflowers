"use client";

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
    h2: ({ children }) => <h1 className="w-full text-2xl">{children}</h1>,
    h3: ({ children }) => <h1 className="w-full text-xl">{children}</h1>,
    h4: ({ children }) => <h1 className="w-full text-lg">{children}</h1>,
    normal: ({ children }) => (
      <p className="w-full pb-3 text-inherit">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-purple-500">{children}</blockquote>
    ),
  },
  types: {},
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ul className={`mt-2`}>{children}</ul>,
    number: ({ children }) => (
      <ol className={`mt-2 list-decimal`}>{children}</ol>
    ),
  },
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <li
        className={`list-item list-inside`}
        style={{ listStyleType: ' disclosure-closed' }}
      >
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className={`list-item list-inside`}>{children}</li>
    ),
  },
  marks: {
    internalLink: ({ children, value }) => {
      const href = getPathFromDocType(value?.docType, value?.slug?.current)
      return (
        <Link className={`underline text-blue-500`} href={href}>
          {children}
        </Link>
      )
    },
    externalLink: ({ children, value }) => {
      const href = value?.href || ''
      return (
        <a
          className={`underline text-blue-500`}
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
 * @returns {JSX.Element} - The rendered component.
 */
const PortTextWrapper = React.memo((props) => {
  const { className, value, lightboxIdentifier, lightboxCallback = () => {} } = props

  // callback for opening lightbox
  const componentsWithCallback = useMemo(
    function memoedCallback() {
      const { figure, ...otherComponents } = portTextComponents

      return {
        ...otherComponents,
        types: {
          ...portTextComponents.types,
          figure: (typeProps) => (
            <PortTextFigure
              portTextProps={typeProps}
              lightboxIdentifier={lightboxIdentifier}
              lightboxCallback={lightboxCallback}
            />
          ),
          imageCollection: (typeProps) => (
            <ThumbnailGrid
              assets={typeProps.value?.imageCollection}
              className={`my-10 bp-900:my-16 bp-900:mx-6 bp-1200:mx-10 gap-[1.5rem_1rem]`}
              cols={2}
              maxItems={12}
              lightboxIdentifier={lightboxIdentifier}
              onClick={lightboxCallback}
              showCaptions
            />
          ),
          portTextVideo: (typeProps) => (
            <PortTextVideo portTextProps={typeProps}></PortTextVideo>
          ),
          teaserSection: (typeProps) => (
            <PortTextTeaser portTextProps={typeProps?.value}></PortTextTeaser>
          )
        },
      }
    },
    [lightboxCallback, lightboxIdentifier],
  )

  return (
    <div className={cx(`port-text`, className)}>
      <PortableText value={value} components={componentsWithCallback} />
    </div>
  )
})

PortTextWrapper.displayName = 'PortTextWrapper'

export default PortTextWrapper
