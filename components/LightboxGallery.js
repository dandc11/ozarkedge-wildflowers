'use client'

import { useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'

import { urlForImage } from '../sanity/lib/sanity.image'
import useLightbox from '../hooks/useLightbox'

// Lazily load the heavy lightbox library on the client only
const SlideshowLightbox = dynamic(
  () => import('lightbox.js-react').then((mod) => mod.SlideshowLightbox),
  { ssr: false, loading: () => null },
)

/**
 * A lightbox gallery component for displaying images in a modal slideshow
 * @param {ReactNode} children - Child elements to render within the lightbox
 * @param {string} className - Additional CSS classes for the lightbox
 * @param {Array|Object} images - Sanity image objects to display
 * @param {string} lightboxIdentifier - Unique identifier for this lightbox instance
 * @param {Function} onOpenCallback - Function called when lightbox opens
 * @param {Function} onCloseCallback - Function called when lightbox closes
 * @param {boolean} showCaptions - Whether to display image captions
 * @param {boolean} showThumbnails - Whether to display thumbnail navigation
 */
const LightboxGallery = ({
  children,
  className = '',
  images = undefined,
  lightboxIdentifier,
  onOpenCallback,
  onCloseCallback = () => {},
  showCaptions = true,
  showThumbnails = true,
}) => {
  useEffect(() => {
    let mounted = true
    const license = process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY
    if (license) {
      // In tests, allow a synchronous require so assertions can observe init immediately
      if (process.env.NODE_ENV === 'test') {
        try {
          // eslint-disable-next-line global-require
          const mod = require('lightbox.js-react')
          if (mounted && typeof mod.initLightboxJS === 'function') {
            mod.initLightboxJS(license, 'individual')
            return () => {
              mounted = false
            }
          }
        } catch (_) {
          // ignore and fall back to dynamic import below
        }
      }

      import('lightbox.js-react')
        .then((mod) => {
          if (mounted && typeof mod.initLightboxJS === 'function') {
            mod.initLightboxJS(license, 'individual')
          }
        })
        .catch(() => {})
    }
    return () => {
      mounted = false
    }
  }, [])
  const memoizedImages = useMemo(() => images, [images])

  const { open, startingSlideIndex, closeLightboxCallback } = useLightbox(
    memoizedImages,
    onOpenCallback,
    onCloseCallback,
    lightboxIdentifier,
  )

  const getFocusableInLightbox = useCallback(() => {
    const container = document.getElementById('lightboxContainer')
    if (!container) return []
    return Array.from(
      container.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
    )
  }, [])

  // Screen reader accessibility: name the dialog, hide background, fix thumbnail alts,
  // and announce slide changes via a live region.
  useEffect(() => {
    const mainContent = document.getElementById('page-content')

    if (!open) {
      mainContent?.removeAttribute('aria-hidden')
      return
    }

    // Hide page content from SR while modal is open (aria-modal alone isn't enough for all SRs)
    mainContent?.setAttribute('aria-hidden', 'true')

    let observer = null
    const timerId = setTimeout(() => {
      const lb = document.getElementById('lightboxContainer')
      if (!lb) return

      // Give the dialog an accessible name
      lb.setAttribute('aria-label', 'Image gallery')

      // Thumbnails rendered by the library have no alt attribute — mark as decorative
      lb.querySelectorAll('img:not([alt])').forEach((img) => img.setAttribute('alt', ''))

      // Inject a live region so SR users hear the image description on slide change
      let announcer = document.getElementById('lightbox-live')
      if (!announcer) {
        announcer = document.createElement('div')
        announcer.id = 'lightbox-live'
        announcer.setAttribute('aria-live', 'polite')
        announcer.setAttribute('aria-atomic', 'true')
        announcer.className = 'sr-only'
        lb.appendChild(announcer)
      }

      // Announce the first image — library renders the description as the only <p>
      const captionEl = lb.querySelector('p')
      if (captionEl?.textContent?.trim()) announcer.textContent = captionEl.textContent.trim()

      // The library swaps entire slide divs on navigation (no src mutation).
      // Watch childList: when a new slide node is added, read its caption <p>.
      observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'childList' && m.addedNodes.length > 0) {
            for (const node of m.addedNodes) {
              if (node.nodeType !== 1) continue
              const caption = node.querySelector?.('p') ?? (node.tagName === 'P' ? node : null)
              if (caption) {
                const liveEl = document.getElementById('lightbox-live')
                if (liveEl) liveEl.textContent = caption.textContent.trim()
                return
              }
            }
          }
        }
      })
      observer.observe(lb, { subtree: true, childList: true })
    }, 150)

    return () => {
      clearTimeout(timerId)
      observer?.disconnect()
      // Remove aria-hidden even on unmount (covers Back-during-open-lightbox in Next.js)
      document.getElementById('page-content')?.removeAttribute('aria-hidden')
    }
  }, [open])

  // Move focus to Close button when lightbox opens.
  // setTimeout beats requestAnimationFrame here because the library sets its own focus
  // in a useEffect (after paint); we need to fire after that settles.
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      const closeBtn = document.querySelector('#lightboxContainer button[aria-label="Close"]')
      const firstFocusable = getFocusableInLightbox()[0]
      ;(closeBtn || firstFocusable)?.focus()
    }, 100)
    return () => clearTimeout(id)
  }, [open, getFocusableInLightbox])

  // Trap focus inside lightbox while open
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusableInLightbox()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, getFocusableInLightbox])
  const imgObjArray = useMemo(() => {
    if (!memoizedImages) return null

    try {
      const imgArray = Array.isArray(memoizedImages) ? memoizedImages : [memoizedImages]
      return imgArray.map((image) => {
        // Create a properly formatted thumbnail URL with absolute dimensions
        const thumbUrl = urlForImage(image, {
          width: 150,
          height: 150,
          fit: 'crop',
          quality: 70,
          auto: 'format',
        }).url()

        // Create a properly formatted original URL
        const originalUrl = urlForImage(image, {
          width: 1024,
          quality: 90,
          auto: 'format',
        }).url()

        return {
          src: thumbUrl,
          original: originalUrl,
          alt: image.alt || '',
          caption: showCaptions ? image.caption || '' : '',
          width: 150,
          height: 150,
          blurDataURL: image.lqip || undefined,
          placeholder: image.lqip ? 'blur' : 'empty',
        }
      })
    } catch (error) {
      console.error('Error processing images for lightbox:', error)
      return []
    }
  }, [memoizedImages, showCaptions])

  return (
    <SlideshowLightbox
      className={className || ''}
      framework={'next'}
      iconColor="white"
      images={imgObjArray}
      imgAnimation="fade"
      leftArrowClassname={'lightbox-arrow'}
      lightboxIdentifier={lightboxIdentifier}
      lightboxImgClass={'lightbox-img'}
      modalClose="clickOutside"
      onClose={closeLightboxCallback}
      open={open}
      rightArrowClassname={'lightbox-arrow'}
      showControls={true}
      showThumbnails={showThumbnails}
      slideshowInterval={3500}
      startingSlideIndex={startingSlideIndex}
      theme="lightbox"
      thumbnailBorder="silver"
      thumbnailClassName="lightbox-thumbnail"
      thumbnailHeight={150}
      thumbnailWidth={150}
    >
      {children}
    </SlideshowLightbox>
  )
}

export default LightboxGallery
