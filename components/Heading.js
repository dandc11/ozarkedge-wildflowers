'use client'

import cx from 'classnames'
import React, { useState, useEffect, useRef } from 'react'

import TableOfContents from './TableOfContents'

const HeadingElement = ({
  headingChildren,
  headingLevel = 2,
  headingBgClass,
  headingCSS,
  styleObject,
  children,
}) => {
  let Heading
  switch (headingLevel) {
    case 1:
      Heading = 'h1'
      break
    case 2:
      Heading = 'h2'
      break
    case 3:
      Heading = 'h3'
      break
    case 4:
      Heading = 'h4'
      break
    case 5:
      Heading = 'h5'
      break
    case 6:
      Heading = 'h6'
      break
    default:
      Heading = 'h2'
  }
  return (
    <>
      <Heading style={styleObject} className={headingCSS}>
        {children}
        <div className={cx(`heading-bg`, headingBgClass)}></div>
      </Heading>
    </>
  )
}
/**
 * Represents a heading component with optional table of contents and circle.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} [props.absolute=false] - Whether the heading is positioned absolutely.
 * @param {React.ReactNode} props.children - The content of the heading.
 * @param {string} [props.circleColorClass] - The CSS class for the circle element.
 * @param {string} [props.className=''] - The CSS class for the heading container.
 * @param {string} [props.headingBgClass=''] - The CSS class for the heading background.
 * @param {string} [props.headingClassName=''] - The CSS class for the heading element.
 * @param {number} [props.headingLevel=2] - The level of the heading (1-6).
 * @param {string} [props.id] - The ID of the heading element.
 * @param {boolean} [props.showCircle=false] - Whether to show the circle element.
 * @param {Array} [props.tocLinks=null] - The table of contents links.
 * @param {string} [props.textTypeClass='thin'] - The CSS class for the text type.
 * @returns {JSX.Element} The rendered heading component.
 */
const Heading = (props) => {
  const {
    absolute = false,
    children,
    circleColorClass,
    className = '',
    headingBgClass = '',
    headingClassName = '',
    headingLevel = 2,
    id,
    showCircle = false,
    tocLinks = null,
    textTypeClass = 'thin',
  } = props
  const tableOfContentsRef = useRef(null)
  const circleButtonRef = useRef(null)
  const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false)
  const toggleTableOfContents = () => {
    setTableOfContentsOpen(!tableOfContentsOpen)
  }
  const headingCSS = cx('heading-title', { relative: showCircle }, textTypeClass, headingClassName)

  // Closes table of contents if clicked outside
  const onClickOutside = (e) => {
    if (
      tableOfContentsRef.current &&
      !tableOfContentsRef.current.contains(e.target) &&
      tableOfContentsRef.current !== e.target &&
      !e.target.classList.contains('heading-circle')
    ) {
      setTableOfContentsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  // Move focus to first ToC link when opened
  useEffect(() => {
    if (tableOfContentsOpen) {
      const firstLink = tableOfContentsRef.current?.querySelector('a')
      firstLink?.focus()
    }
  }, [tableOfContentsOpen])

  // Close when focus leaves the toc-wrapper entirely
  const handleTocBlur = (e) => {
    if (!e.relatedTarget) return
    if (!tableOfContentsRef.current?.contains(e.relatedTarget)) {
      setTableOfContentsOpen(false)
    }
  }

  // Escape from within the ToC closes it and returns focus to circle
  const handleTocKeyDown = (e) => {
    if (e.key === 'Escape') {
      setTableOfContentsOpen(false)
      circleButtonRef.current?.focus()
    }
  }

  // Escape on the circle button closes ToC when open
  const handleCircleKeyDown = (e) => {
    if (e.key === 'Escape' && tableOfContentsOpen) {
      setTableOfContentsOpen(false)
    }
  }

  const circleColor = circleColorClass || null
  const circleClassName = cx(
    'heading-circle',
    {
      'has-toc': tocLinks != null,
      active: tocLinks != null && tableOfContentsOpen,
    },
    circleColor,
  )

  return (
    <div id={id} className={cx('heading', { absolute: absolute }, className)}>
      {tocLinks && (
        <div
          ref={tableOfContentsRef}
          className={cx('toc-wrapper', {
            'grid-rows-1fr': tableOfContentsOpen,
            'grid-rows-0': !tableOfContentsOpen,
          })}
          inert={!tableOfContentsOpen}
          onBlur={handleTocBlur}
          onKeyDown={handleTocKeyDown}
        >
          <div className="overflow-hidden relative">
            <TableOfContents className={cx('p-in-xl')} links={tocLinks} />
          </div>
        </div>
      )}
      <HeadingElement
        headingLevel={headingLevel}
        headingCSS={headingCSS}
        headingChildren={children}
        headingBgClass={headingBgClass}
      >
        {showCircle && (
          <button
            ref={circleButtonRef}
            className={circleClassName}
            onClick={toggleTableOfContents}
            onKeyDown={handleCircleKeyDown}
            aria-expanded={tableOfContentsOpen}
            aria-label="Toggle table of contents"
          />
        )}
        {children}
      </HeadingElement>
    </div>
  )
}

export default Heading
