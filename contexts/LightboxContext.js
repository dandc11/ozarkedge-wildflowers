'use client'

import React, { createContext, useState } from 'react'
export const LightboxContext = React.createContext()

export const LightboxProvider = ({ children }) => {
  const [lightboxImgArray, setLightboxImgArray] = useState([])
  const [lightBoxOpenIndex, setLightBoxOpenIndex] = useState([])

  return (
    <LightboxContext.Provider
      value={{
        lightboxImgArray,
        setLightboxImgArray,
        lightBoxOpenIndex,
        setLightBoxOpenIndex,
      }}
    >
      {children}
    </LightboxContext.Provider>
  )
}
