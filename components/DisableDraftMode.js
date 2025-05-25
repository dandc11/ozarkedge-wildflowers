'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { disableDraftMode } from '../app/actions'

export function DisableDraftMode() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  if (window && window !== window.parent) {
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
