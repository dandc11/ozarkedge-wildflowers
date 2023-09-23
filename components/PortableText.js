import { PortableText } from '@portabletext/react'
import cx from 'classnames'
import Link from 'next/link'
import React, { useMemo } from 'react'

import { DOCTYPE_PATH_PREFIXES } from '../utilities/constants'
import { getPathFromDocType } from '../utilities/helperUtil'
import ResponsiveImage from './ResponsiveImage'

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
 * @returns {JSX.Element} - The rendered component.
 */
const PortTextWrapper = React.memo((props) => {
  const { className, value, lightboxIdentifier = '', lightboxCallback } = props

  // callback for opening lightbox
  const componentsWithCallback = useMemo(
    function memoedCallback() {
      const { figure, ...otherComponents } = portTextComponents

      return {
        ...otherComponents,
        types: {
          ...portTextComponents.types,
          figure: (typeProps) => {
            const widths = {
              '20%': 'w-full bp-600:w-[20%]',
              '25%': 'w-full bp-600:w-1/4',
              '33%': 'w-full bp-600:w-1/3',
              '50%': 'w-full bp-600:w-1/2',
              '66%': 'w-full bp-600:w-2/3',
              '75%': 'w-full bp-600:w-3/4',
              '100%': 'w-full',
            }

            const widthClass = typeProps.value?.imageWidth
              ? widths[typeProps.value?.imageWidth]
              : 'w-full bp-600:w-1/2'
            const positions = {
              left: `my-5 bp-600:float-left bp-600:mr-4 bp-600:my-0 ${
                typeProps.value?.imageWidth
                  ? widths[typeProps.value?.imageWidth]
                  : 'bp-600:w-[20%]'
              }`,
              right: `my-5 bp-600:float-right bp-600:ml-4 bp-600:my-0 ${
                typeProps.value?.imageWidth
                  ? widths[typeProps.value?.imageWidth]
                  : 'bp-600:w-[20%]'
              }`,
              center: `flex justify-center my-5`,
            }
            const positionClass = typeProps.value?.imagePosition
              ? positions[typeProps.value?.imagePosition]
              : positions['center']
            return (
              <>
                <ResponsiveImage
                  image={typeProps.value}
                  priority={false}
                  captionStyle={typeProps.value?.captionPosition}
                  showCaption={true}
                  lightboxIdentifier={lightboxIdentifier}
                  figureClassName={cx(
                    `${
                      typeProps.value?.imagePosition !== 'left' &&
                      typeProps.value?.imagePosition !== 'right'
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
          },
        },
      }
    },
    [lightboxCallback],
  )

  return (
    <div className={cx(`port-text`, className)}>
      <PortableText value={value} components={componentsWithCallback} />
    </div>
  )
})

PortTextWrapper.displayName = 'PortTextWrapper'

export default PortTextWrapper
