/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen, fireEvent, waitFor } from '../tests/utils/test-utils'
import { LightboxContext } from '../contexts/LightboxContext'
import LightboxGallery from './LightboxGallery'
import InteractiveImage from './InteractiveImage'

// Use real hook, so do NOT mock '../hooks/useLightbox'
// Mock only external lightbox library and image URL builder
const mockSlideshow = jest.fn(({ children, ...rest }) => (
  <div data-testid="slideshow" {...rest}>
    {children}
    <pre data-testid="slideshow-props">
      {JSON.stringify({ ...rest, images: rest.images?.length })}
    </pre>
  </div>
))

jest.mock('lightbox.js-react', () => ({
  initLightboxJS: jest.fn(),
  SlideshowLightbox: (props) => mockSlideshow(props),
}))

jest.mock('../sanity/lib/sanity.image', () => ({
  urlForImage: (image, opts = {}) => ({
    url: () => `https://cdn.sanity.io/images/test/${image?.asset?._ref || 'no-ref'}.jpg`,
  }),
}))

// Helper to build image objects
const makeImage = (ref, extra = {}) => ({
  _type: 'image',
  asset: { _ref: ref, _type: 'reference' },
  alt: `Alt ${ref}`,
  caption: `Caption ${ref}`,
  ...extra,
})

describe('LightboxGallery integration (real hook)', () => {
  beforeEach(() => {
    mockSlideshow.mockClear()
  })

  it('opens lightbox and sets starting slide index based on context-triggered image key', async () => {
    const images = [makeImage('ref1'), makeImage('ref2'), makeImage('ref3')]

    // Custom provider so we can manipulate context after initial render
    const contextValue = {
      lightboxOpenImgKey: null,
      setLightBoxOpenImgKey: jest.fn((val) => {
        contextValue.lightboxOpenImgKey = val
      }),
      lightboxIdentifier: null,
      setLightboxIdentifier: jest.fn((val) => {
        contextValue.lightboxIdentifier = val
      }),
    }

    const { rerender } = render(
      <LightboxContext.Provider value={contextValue}>
        <LightboxGallery images={images} lightboxIdentifier="gallery-int" />
      </LightboxContext.Provider>,
    )

    // Wait for initial slideshow render before inspecting mock calls
    await screen.findByTestId('slideshow')
    await waitFor(() => {
      expect(mockSlideshow.mock.calls.length).toBeGreaterThan(0)
      const firstCall = mockSlideshow.mock.calls[0][0]
      expect(firstCall.open === undefined || firstCall.open === false).toBe(true)
    })

    // Simulate clicking second image via InteractiveImage to set context
    // We'll render an InteractiveImage that sets keys on click
    rerender(
      <LightboxContext.Provider value={contextValue}>
        <>
          <InteractiveImage image={images[1]} lightboxIdentifier="gallery-int" />
          <LightboxGallery images={images} lightboxIdentifier="gallery-int" />
        </>
      </LightboxContext.Provider>,
    )

    // Trigger opening by clicking interactive image figure
    const interactiveFigure = document.querySelector('figure[data-lightboxjs="gallery-int"]')
    expect(interactiveFigure).toBeTruthy()
    fireEvent.click(interactiveFigure)

    // Rerender to propagate updated context through hook
    rerender(
      <LightboxContext.Provider value={contextValue}>
        <>
          <InteractiveImage image={images[1]} lightboxIdentifier="gallery-int" />
          <LightboxGallery images={images} lightboxIdentifier="gallery-int" />
        </>
      </LightboxContext.Provider>,
    )

    // Wait for a mock call where open becomes true
    await waitFor(() => {
      const lastIdx = mockSlideshow.mock.calls.length - 1
      const call = mockSlideshow.mock.calls[lastIdx][0]
      expect(call.images?.length).toBe(3)
      expect(call.open).toBe(true)
      expect(call.startingSlideIndex).toBe(1)
    })
  })

  it('closes lightbox and resets context when onClose invoked', async () => {
    const images = [makeImage('ref1'), makeImage('ref2')]
    const contextValue = {
      lightboxOpenImgKey: null,
      setLightBoxOpenImgKey: jest.fn((val) => {
        contextValue.lightboxOpenImgKey = val
      }),
      lightboxIdentifier: null,
      setLightboxIdentifier: jest.fn((val) => {
        contextValue.lightboxIdentifier = val
      }),
    }

    const { rerender } = render(
      <LightboxContext.Provider value={contextValue}>
        <>
          <InteractiveImage image={images[0]} lightboxIdentifier="gallery-close" />
          <LightboxGallery images={images} lightboxIdentifier="gallery-close" />
        </>
      </LightboxContext.Provider>,
    )

    // Open via click
    // Wait until the interactive image figure is present
    let interactiveFigure
    await waitFor(() => {
      interactiveFigure = document.querySelector('figure[data-lightboxjs="gallery-close"]')
      expect(interactiveFigure).toBeTruthy()
    })
    fireEvent.click(interactiveFigure)
    rerender(
      <LightboxContext.Provider value={contextValue}>
        <>
          <InteractiveImage image={images[0]} lightboxIdentifier="gallery-close" />
          <LightboxGallery images={images} lightboxIdentifier="gallery-close" />
        </>
      </LightboxContext.Provider>,
    )

    // Wait for open
    await waitFor(() => {
      const lastCall = mockSlideshow.mock.calls[mockSlideshow.mock.calls.length - 1][0]
      expect(lastCall.open).toBe(true)
    })

    // Invoke onClose handler from latest slideshow call
    const latest = mockSlideshow.mock.calls[mockSlideshow.mock.calls.length - 1][0]
    latest.onClose()

    // Rerender to propagate closed state
    rerender(
      <LightboxContext.Provider value={contextValue}>
        <>
          <InteractiveImage image={images[0]} lightboxIdentifier="gallery-close" />
          <LightboxGallery images={images} lightboxIdentifier="gallery-close" />
        </>
      </LightboxContext.Provider>,
    )

    await waitFor(() => {
      const lastCall = mockSlideshow.mock.calls[mockSlideshow.mock.calls.length - 1][0]
      expect(lastCall.open).toBe(false)
      expect(contextValue.lightboxOpenImgKey).toBeNull()
      expect(contextValue.lightboxIdentifier).toBeNull()
    })
  })
})
