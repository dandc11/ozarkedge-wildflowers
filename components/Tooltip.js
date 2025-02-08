import React from 'react'

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
      className={`absolute ${textColorClass} ${bgColorClass} text-xs rounded p-bk-xxs p-in-md shadow-md`}
      style={styles}
      ref={buttonElementRef}
    >
      {children}
    </div>
  )
}

export default Tooltip
