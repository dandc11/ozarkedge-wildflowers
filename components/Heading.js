import cx from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import { getCurrentSeason } from '../utilities/helperUtil'
import TableOfContents from './TableOfContents'

const HeadingElement = ({ headingChildren, headingLevel, headingCSS, children }) => {
  let Heading;
  switch (headingLevel) {
    case 1:
      Heading = 'h1';
      break;
    case 2:
      Heading = 'h2';
      break;
    case 3:
      Heading = 'h3';
      break;
    case 4:
      Heading = 'h4';
      break;
    case 5:
      Heading = 'h5';
      break;
    case 6:
      Heading = 'h6';
      break;
    default:
      Heading = 'h2';
  }
  return <Heading className={headingCSS}>{children}</Heading>;
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
 * @param {string} [props.headingClassName=''] - The CSS class for the heading element.
 * @param {number} [props.headingLevel=2] - The level of the heading (1-6).
 * @param {string} [props.id] - The ID of the heading element.
 * @param {boolean} [props.showCircle=false] - Whether to show the circle element.
 * @param {Array} [props.tocLinks=null] - The table of contents links.
 * @returns {JSX.Element} The rendered heading component.
 */
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
    textTypeClass = 'thin'
  } = props
  const tableOfContentsRef = useRef(null)
  const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false)
  const toggleTableOfContents = () => {
    setTableOfContentsOpen(!tableOfContentsOpen)
  }
  const headingCSS = cx('heading', textTypeClass, headingClassName)

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

  

  return (
    <div
      id={id}
      className={cx('header-base', { absolute: absolute }, className)}
    >
      {' '}
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
      <HeadingElement headingLevel={headingLevel} headingCSS={headingCSS} headingChildren={children}>
        {showCircle && (
          <div
            className={circleClassName}
            onClick={toggleTableOfContents}
          ></div>
        )}
        {children}
      </HeadingElement>
    </div>
  )
}

export default Heading
