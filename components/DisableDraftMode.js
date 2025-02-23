'use client'

import { useDraftModeEnvironment } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment()

  // Only show the disable draft mode button when outside of Presentation Tool
  if (environment !== 'live' && environment !== 'unknown') {
    return null
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="draftmode-btn fixed bottom-4 right-4 bg-gray-50 p-in-xs p-bk-xs"
    >
      Disable Draft Mode
    </a>
  )
}
