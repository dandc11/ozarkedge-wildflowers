'use client'

import { useEffect, useContext } from 'react'

import { NavContext } from '../contexts/NavContext'

/**
 * ContextUpdater Component - Updates the nav button color in the NavContext
 * @category Components
 * @param {Object} props
 * @param {string} props.navButtonColor - The nav button color
 * @returns
 */
const ContextUpdater = ({ navButtonColor }) => {
  const { setNavButtonColor } = useContext(NavContext)
  let color = navButtonColor ? navButtonColor : 'light'
  useEffect(() => {
    if (navButtonColor) {
      setNavButtonColor(color)
    }
  }, [navButtonColor, color, setNavButtonColor])

  return null
}

export default ContextUpdater
