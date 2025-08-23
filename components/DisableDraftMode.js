'use client'

import { useTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { disableDraftMode } from '../app/actions'

export function DisableDraftMode() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [isInIframe, setIsInIframe] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsInIframe(window !== window.parent)
  }, [])

  // Don't render during SSR or if in iframe
  if (!isClient || isInIframe) {
    return null
  }

  const disable = () =>
    startTransition(async () => {
      await disableDraftMode()
      router.refresh()
    })

  return (
    <div className="test-disable-draft-mode">
      {pending ? (
        'Disabling draft mode...'
      ) : (
        <button type="button" className="draftmode-btn" onClick={disable}>
          Disable draft mode
        </button>
      )}
    </div>
  )
}
