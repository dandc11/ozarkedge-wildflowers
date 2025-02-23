'use client'

import React, { useState } from 'react'
export const LightboxContext = React.createContext()

export const LightboxProvider = ({ children }) => {
  const [lightboxOpenImgKey, setLightBoxOpenImgKey] = useState(null)
  const [lightboxIdentifier, setLightboxIdentifier] = useState(null)

  return (
    <LightboxContext.Provider
      value={{
        lightboxOpenImgKey,
        setLightBoxOpenImgKey,
        lightboxIdentifier,
        setLightboxIdentifier,
      }}
    >
      {children}
    </LightboxContext.Provider>
  )
}
