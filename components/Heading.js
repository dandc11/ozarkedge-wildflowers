import cx from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import { getCurrentSeason } from '../utilities/helperUtil'
import TableOfContents from './TableOfContents'

const Heading = (props) => {
  const {
    absolute = false,
    children,
    circleColorClass,
    className = '',
    headingClassName = '',
    headingLevel = 2,
    id,
    showCircle = false,
    tocLinks = null,
  } = props
  const tableOfContentsRef = useRef(null)
  const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false)
  const toggleTableOfContents = () => {
    setTableOfContentsOpen(!tableOfContentsOpen)
  }
  const headingCSS = cx('heading', headingClassName)

  // Closes table of contents if clicked outside
  const onClickOutside = (e) => {
    if (
      tableOfContentsRef.current &&
      !tableOfContentsRef.current.contains(e.target) &&
      tableOfContentsRef.current !== e.target &&
      !e.target.classList.contains('header-circle')
    ) {
      setTableOfContentsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  const currentSeason = getCurrentSeason()
  const circleColor = circleColorClass
    ? `${circleColorClass}`
    : currentSeason.ACCENT_COLOR_CLASS
  const circleClassName = cx(
    'header-circle absolute font-normal w-16 h-16 rounded-full -z-10 opacity-60 bg-oe-red-200 transition-all ease-in duration-150 -top-[1rem] -left-6 bp-600:left-[-2rem] bp-900:w-20 bp-900:h-20 bp-900:top-[-1.5rem] bp-900:left-[-2.7rem]',
    {
      'cursor-pointer hover:bg-oe-red-300 hover:opacity-70 hover:scale-110':
        tocLinks != null,
      'z-50': tocLinks != null && tableOfContentsOpen,
    },
    circleColor,
  )

  let HeadingElement
  switch (headingLevel) {
    case 1:
      HeadingElement = <h1 className={headingCSS}>{children}</h1>
    case 2:
      HeadingElement = <h2 className={headingCSS}>{children}</h2>
    case 3:
      HeadingElement = <h3 className={headingCSS}>{children}</h3>
    case 4:
      HeadingElement = <h4 className={headingCSS}>{children}</h4>
    case 5:
      HeadingElement = <h5 className={headingCSS}>{children}</h5>
    case 6:
      HeadingElement = <h6 className={headingCSS}>{children}</h6>
    default:
      HeadingElement = <h2 className={headingCSS}>{children}</h2>
  }

  return (
    <div
      id={id}
      className={cx('header-base relative', { absolute: absolute }, className)}
    >
      {' '}
      {showCircle && (
        <div className={circleClassName} onClick={toggleTableOfContents}></div>
      )}
      {tocLinks && (
        <div
          ref={tableOfContentsRef}
          className={cx(
            'absolute grid transition-z-50 transition-all duration-500 ease-in-out',
            {
              'z-50 grid-rows-[1fr]': tableOfContentsOpen,
              'grid-rows-[0fr]': !tableOfContentsOpen,
            },
          )}
        >
          <div className="overflow-hidden relative">
            <TableOfContents className={cx('px-8 w-80')} links={tocLinks} />
          </div>
        </div>
      )}
      {HeadingElement}
    </div>
  )
}

export default Heading
