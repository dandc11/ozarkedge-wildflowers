import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import { getCurrentSeason } from '../utilities/helperUtil'
import TableOfContents from './TableOfContents'

const Header = (props) => {
  const {
    absolute = false,
    children,
    circleColorClass,
    className = '',
    headerClassName = '',
    id,
    showCircle = false,
    tocLinks = null,
  } = props
  const tableOfContentsRef = useRef(null)
  const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false)
  const toggleTableOfContents = () => {
    setTableOfContentsOpen(!tableOfContentsOpen)
  }

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
    'header-circle absolute font-normal w-16 h-16 rounded-full -z-10 opacity-60 bg-oe-red-200 transition-all ease-in duration-150 -top-[1rem] -left-6 bp-600:left-[-2rem] bp-900:w-20 bp-900:h-20 bp-900:top-[-1.5rem] bp-900:left-[-2.7rem] hover:bg-oe-red-300 hover:opacity-70 hover:scale-110',
    { 'cursor-pointer': tocLinks != null, 'z-50': tableOfContentsOpen },
    circleColor,
  )

  return (
    <div
      id={id}
      className={cx('header-base ', { absolute: absolute }, className)}
    >
      <h2
        className={cx('relative', headerClassName)}

      >
        {' '}
        {showCircle && <div className={circleClassName} onClick={toggleTableOfContents}></div>}
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
        <span>{children}</span>
      </h2>
    </div>
  )
}

export default Header
