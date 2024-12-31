import React from 'react'

/**
 * Tooltip component
 * @param {object} props
 * @param {object} props.buttonElementRef - Reference to the button element
 * @param {boolean} props.isVisible - Whether the tooltip is visible
 * @param {object} props.position - Position of the tooltip
 * @param {string} props.textColorClass - Text color class
 * @param {string} props.bgColorClass - Background color class
 * @param {ReactNode} props.children - Tooltip content
 * @returns {ReactNode} Tooltip component
 */
const Tooltip = ({
  buttonElementRef,
  isVisible,
  children,
  position = { top: 0, left: 0, width: 0 },
  textColorClass = 'text-white',
  bgColorClass = 'bg-gray-700',
}) => {
  const { top, left, width } = position
  const styles = {
    top: `${top}px`,
    left: `${left + width / 2}px`,
    visibility: isVisible ? 'visible' : 'hidden',
  }

  return (
    <div
      className={`absolute ${textColorClass} ${bgColorClass} text-xs rounded py-1 px-4 shadow-md`}
      style={styles}
      ref={buttonElementRef}
    >
      {children}
    </div>
  )
}

export default Tooltip
