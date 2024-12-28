import cx from 'classnames'
import React from 'react'

const HeadingElement = ({
  headingChildren,
  headingLevel,
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
    <Heading style={styleObject} className={headingCSS}>
      {children}
    </Heading>
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
 * @param {string} [props.headingClassName=''] - The CSS class for the heading element.
 * @param {number} [props.headingLevel=2] - The level of the heading (1-6).
 * @param {string} [props.id] - The ID of the heading element.
 * @param {boolean} [props.showCircle=false] - Whether to show the circle element.
 * @param {Array} [props.tocLinks=null] - The table of contents links.
 * @returns {JSX.Element} The rendered heading component.
 */
const HeadingDisplay = (props) => {
  const {
    absolute = false,
    children,
    className = '',
    headingClassName = '',
    headingLevel = 2,
    id,
  } = props
  const headingCSS = cx('heading-title', headingClassName)

  return (
    <div
      id={id}
      className={cx(
        'heading heading-display',
        { absolute: absolute },
        className,
      )}
    >
      <HeadingElement
        headingLevel={headingLevel}
        headingCSS={headingCSS}
        headingChildren={children}
      >
        {children}
      </HeadingElement>
    </div>
  )
}

export default HeadingDisplay
