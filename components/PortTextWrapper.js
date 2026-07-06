import { PortableText } from '@portabletext/react'
import cx from 'classnames'
import Link from 'next/link'
import React from 'react'

import { getPathFromDocType } from '../utilities/helperUtil'
import { editAttribute } from '../sanity/lib/editAttribute'

// Import heavy block components directly; when they are Client Components,
// Next.js will treat them as client boundaries automatically.
import PTFigure from './PortTextFigure'
import PTVideo from './PortTextVideo'
import PTTeaser from './PortTextTeaser'
import PTThumbnailGrid from './ThumbnailGrid'

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
      <li className={`list-item list-inside disclosure-closed`}>{children}</li>
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
          target={value?.blank ? '_blank' : undefined}
          rel={value?.blank ? 'noopener noreferrer' : undefined}
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
 * @param {string} props.lightboxIdentifier - The identifier for the lightbox.
 * @param {string} props.documentId - The ID of the Sanity document.
 * @param {string} props.documentType - The type of the Sanity document.
 * @param {string} props.portableTextPath - The path to the portable text field within the document.
 * @returns {JSX.Element} - The rendered component.
 */
const PortTextWrapper = (props) => {
  const {
    className,
    value,
    lightboxIdentifier,
    // Note: Do not pass function props from a Server Component; interactive behavior is handled in client components via context
    documentId = '', // Added prop
    documentType = '', // Added prop
    portableTextPath, // Added prop
  } = props

  // Build a `data-sanity` edit-target string for a media block so Visual Editing
  // can map an overlay click to the block's field. Non-text blocks (images,
  // collections, videos) don't carry stega markers, so they need this attribute.
  // Returns undefined when we lack the document/field context to resolve a path.
  const makeMediaDataAttr = (blockKey) =>
    blockKey
      ? editAttribute(documentId, documentType, `${portableTextPath}[_key=="${blockKey}"]`)
      : undefined

  // Compose a components map that SSRs text but defers media blocks to the client
  const componentsWithCallback = {
    ...portTextComponents,
    types: {
      ...portTextComponents.types,
      figure: (typeProps) => (
        <PTFigure
          portTextProps={typeProps}
          lightboxIdentifier={lightboxIdentifier}
          dataSanityAttr={makeMediaDataAttr(typeProps.value?._key)}
        />
      ),
      imageCollection: (typeProps) => (
        <PTThumbnailGrid
          assets={typeProps.value?.imageCollection}
          className={`img-collection`}
          cols={2}
          maxItems={12}
          lightboxIdentifier={lightboxIdentifier}
          showCaptions
          dataSanityAttr={makeMediaDataAttr(typeProps.value?._key)}
        />
      ),
      portTextVideo: (typeProps) => (
        <PTVideo
          portTextProps={typeProps}
          dataSanityAttr={makeMediaDataAttr(typeProps.value?._key)}
        />
      ),
      teaserSection: (typeProps) => <PTTeaser portTextProps={typeProps?.value} />,
    },
  }

  return (
    <div className={cx(`port-text`, className)}>
      <PortableText value={value} components={componentsWithCallback} />
    </div>
  )
}

PortTextWrapper.displayName = 'PortTextWrapper'

export default PortTextWrapper
