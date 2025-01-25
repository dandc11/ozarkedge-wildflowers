'use client'

import { LightboxProvider } from '../contexts/LightboxContext'

export default function ContextProviders({ children }) {
  return (
    <>
      <LightboxProvider>{children}</LightboxProvider>
    </>
  )
}
