'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

import config from './../../../sanity.config.js'

// Studio loading component
const StudioLoader = () => (
  <div className="studio-loading-container">
    <div className="studio-loading-content">
      <div className="studio-spinner"></div>
      <p className="studio-loading-text">Loading Sanity Studio...</p>
    </div>
  </div>
)

// Enhanced lazy loading with better chunking
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => ({ default: mod.NextStudio })),
  {
    ssr: false,
    loading: StudioLoader,
  },
)

export default function StudioPage() {
  // when this component is loaded, the navigation should be hidden

  return (
    <Suspense fallback={<StudioLoader />}>
      <NextStudio config={config} />
    </Suspense>
  )
}
