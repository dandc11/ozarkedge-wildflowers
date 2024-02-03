import React from 'react'
import { buildBackgroundStyleObject } from '../utilities/imageUtil'
import cx from 'classnames'

/**
 * A container component that wraps its children with a specified tag and applies CSS classes and background styles.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string[]} props.className - A string of CSS class names.
 * @param {React.ReactNode} props.children - The children elements to be wrapped by the container.
 * @param {Object} props.bgParamObj - An object containing background parameters for the container.
 * @param {string} props.tag - The HTML tag to use for the container ('none', 'div', or 'section').
 * @returns {JSX.Element} The rendered container component.
 * @example
 * return (
 *  <Container
 *   className=""
 *   tag="div"
  *  bgParamObj={{
 *      bgImage: headerImage,
 *      bgColor: COLORS['oe-blue-dark-300'],
 *      bgBlendMode: 'multiply',
 *      bgPosition: 'center',
 * }}
 * >
 */

const Container = ({
  className,
  children,
  bgParamObj = undefined,
  tag,
  ...props
}) => {
  const bgStyle = bgParamObj ? buildBackgroundStyleObject(bgParamObj) : {}

  return (
    <>
      {tag === 'none' && <>{children}</>}
      {tag === 'div' && (
        <div className={cx('bg-container', className)} style={bgStyle}>
          {children}
        </div>
      )}
      {tag === 'section' && (
        <section className={cx('bg-container', className)} style={bgStyle}>
          {children}
        </section>
      )}
    </>
  )
}

export default Container
