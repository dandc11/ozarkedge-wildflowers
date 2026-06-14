import { useEffect, useContext, useState, useCallback, useMemo, useRef } from 'react'

import { LightboxContext } from '../contexts/LightboxContext'

// JS Doc
/**
 * The useLightbox hook. This hook is used to open and close the lightbox.
 * @typedef {Object} LightboxProps
 * @property {Array} images - The array of images
 * @property {Function} onOpenCallback - The callback function for when the lightbox opens
 * @property {Function} onCloseCallback - The callback function for when the lightbox closes
 * @returns {Object} - The open state and the starting slide index
 * */
const useLightbox = (images, onOpenCallback, onCloseCallback, identifier) => {
  const { lightboxOpenImgKey, setLightBoxOpenImgKey, lightboxIdentifier, setLightboxIdentifier } =
    useContext(LightboxContext)
  const [open, setOpen] = useState(false)
  const [startingSlideIndex, setStartingSlideIndex] = useState(0)
  const triggerRef = useRef(null)

  const memoizedImages = useMemo(() => images, [images])

  useEffect(() => {
    if (lightboxOpenImgKey && memoizedImages && lightboxIdentifier === identifier) {
      triggerRef.current = document.activeElement
      const index = memoizedImages.findIndex((e) => e.asset._ref === lightboxOpenImgKey)
      setStartingSlideIndex(index)
      setOpen(true)
      if (onOpenCallback) {
        onOpenCallback()
      }
    } else {
      setOpen(false)
    }
  }, [lightboxOpenImgKey, memoizedImages, onOpenCallback, lightboxIdentifier, identifier])

  const closeLightboxCallback = useCallback(() => {
    const trigger = triggerRef.current
    triggerRef.current = null
    setLightBoxOpenImgKey(null)
    setLightboxIdentifier(null)
    setOpen(false)
    if (onCloseCallback) {
      onCloseCallback()
    }
    // Restore focus to the trigger after React unmounts the lightbox
    if (trigger) setTimeout(() => trigger.focus(), 0)
  }, [onCloseCallback, setLightBoxOpenImgKey, setLightboxIdentifier])

  return { open, startingSlideIndex, closeLightboxCallback }
}

export default useLightbox
