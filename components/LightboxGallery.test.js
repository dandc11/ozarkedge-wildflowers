/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen } from '../tests/utils/test-utils'
import LightboxGallery from './LightboxGallery'

// Mocks
const mockInit = jest.fn()
const mockSlideshow = jest.fn(({ children, ...rest }) => (
  <div data-testid="slideshow" {...rest}>
    {children}
    {/* expose props for assertions */}
    <pre data-testid="slideshow-props">{JSON.stringify(rest)}</pre>
  </div>
))

jest.mock('lightbox.js-react', () => ({
  initLightboxJS: (...args) => mockInit(...args),
  SlideshowLightbox: (props) => mockSlideshow(props),
}))

// URL builder only needs deterministic URL + error simulation
const mockUrlForImage = jest.fn((image) => ({
  url: () => {
    if (!image || image.__triggerError) throw new Error('builder error')
    const ref = image?.asset?._ref || 'no-ref'
    return `https://cdn.sanity.io/images/test/${ref}.jpg`
  },
}))

jest.mock('../sanity/lib/sanity.image', () => ({
  urlForImage: (...args) => mockUrlForImage(...args),
}))

const hookReturn = {
  open: false,
  startingSlideIndex: 0,
  closeLightboxCallback: jest.fn(),
}

const mockUseLightbox = jest.fn(() => hookReturn)
jest.mock('../hooks/useLightbox', () => ({
  __esModule: true,
  default: (...args) => mockUseLightbox(...args),
}))

// Helpers
const baseImage = (overrides = {}) => ({
  _type: 'image',
  asset: { _ref: overrides.ref || 'image-ref-1', _type: 'reference' },
  alt: 'Alt text',
  caption: 'Caption text',
  lqip: overrides.lqip,
  ...overrides,
})

describe('LightboxGallery', () => {
  const ORIGINAL_ENV = process.env
  beforeEach(() => {
    mockInit.mockClear()
    mockSlideshow.mockClear()
    mockUrlForImage.mockClear()
    Object.defineProperty(process, 'env', { value: { ...ORIGINAL_ENV } })
    mockUseLightbox.mockClear()
    // reset hookReturn mutable values
    hookReturn.open = false
    hookReturn.startingSlideIndex = 0
  })

  afterAll(() => {
    Object.defineProperty(process, 'env', { value: ORIGINAL_ENV })
  })

  describe('license initialization', () => {
    it('initializes lightbox when license key present', () => {
      process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY = 'LICENSE'
      render(<LightboxGallery images={[baseImage()]} lightboxIdentifier="gal" />)
      expect(mockInit).toHaveBeenCalledWith('LICENSE', 'individual')
    })

    it('does not initialize when license key absent', () => {
      delete process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY
      render(<LightboxGallery images={[baseImage()]} lightboxIdentifier="gal" />)
      expect(mockInit).not.toHaveBeenCalled()
    })
  })

  describe('image mapping', () => {
    it('maps array of images to expected structure', () => {
      const imgs = [baseImage({ ref: 'r1', lqip: 'lqip1' }), baseImage({ ref: 'r2' })]
      render(<LightboxGallery images={imgs} lightboxIdentifier="gal" />)
      const props = JSON.parse(screen.getByTestId('slideshow-props').textContent)
      expect(props.images).toHaveLength(2)
      expect(props.images[0]).toMatchObject({
        alt: 'Alt text',
        caption: 'Caption text',
        blurDataURL: 'lqip1',
        placeholder: 'blur',
        width: 150,
        height: 150,
      })
      expect(props.images[1].placeholder).toBe('empty')
    })

    it('handles single image object by wrapping into array', () => {
      render(<LightboxGallery images={baseImage({ ref: 'single' })} lightboxIdentifier="gal" />)
      const props = JSON.parse(screen.getByTestId('slideshow-props').textContent)
      expect(props.images).toHaveLength(1)
    })

    it('returns null images when no images prop supplied', () => {
      render(<LightboxGallery lightboxIdentifier="gal" />)
      const props = JSON.parse(screen.getByTestId('slideshow-props').textContent)
      expect(props.images).toBeNull()
    })

    it('omits captions when showCaptions is false', () => {
      render(
        <LightboxGallery images={[baseImage()]} showCaptions={false} lightboxIdentifier="gal" />,
      )
      const props = JSON.parse(screen.getByTestId('slideshow-props').textContent)
      expect(props.images[0].caption).toBe('')
    })

    it('passes showThumbnails flag correctly', () => {
      render(
        <LightboxGallery images={[baseImage()]} showThumbnails={false} lightboxIdentifier="gal" />,
      )
      const props = JSON.parse(screen.getByTestId('slideshow-props').textContent)
      expect(props.showThumbnails).toBe(false)
    })

    it('logs error and returns empty array when builder throws', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const badImage = { __triggerError: true }
      render(<LightboxGallery images={[badImage]} lightboxIdentifier="gal" />)
      const props = JSON.parse(screen.getByTestId('slideshow-props').textContent)
      expect(props.images).toEqual([])
      expect(errorSpy).toHaveBeenCalled()
      errorSpy.mockRestore()
    })
  })

  describe('hook integration', () => {
    it('passes open & startingSlideIndex from hook', () => {
      hookReturn.open = true
      hookReturn.startingSlideIndex = 3
      render(<LightboxGallery images={[baseImage()]} lightboxIdentifier="gal" />)
      const props = JSON.parse(screen.getByTestId('slideshow-props').textContent)
      expect(props.open).toBe(true)
      expect(props.startingSlideIndex).toBe(3)
    })

    it('invokes close callback from hook when SlideshowLightbox onClose triggered', () => {
      hookReturn.closeLightboxCallback.mockClear()
      render(<LightboxGallery images={[baseImage()]} lightboxIdentifier="gal" />)
      // Retrieve actual props used to render mocked SlideshowLightbox
      const slideshowCall = mockSlideshow.mock.calls[mockSlideshow.mock.calls.length - 1]
      const slideshowProps = slideshowCall ? slideshowCall[0] : {}
      expect(typeof slideshowProps.onClose).toBe('function')
      slideshowProps.onClose()
      expect(hookReturn.closeLightboxCallback).toHaveBeenCalled()
    })

    it('forwards onOpenCallback and onCloseCallback to hook with correct params', () => {
      const onOpen = jest.fn()
      const onClose = jest.fn()
      const imgs = [baseImage({ ref: 'forward' })]
      render(
        <LightboxGallery
          images={imgs}
          lightboxIdentifier="gal"
          onOpenCallback={onOpen}
          onCloseCallback={onClose}
        />,
      )
      const lastCall = mockUseLightbox.mock.calls[mockUseLightbox.mock.calls.length - 1]
      expect(lastCall).toBeDefined()
      expect(lastCall[0]).toBe(imgs)
      expect(lastCall[1]).toBe(onOpen)
      expect(lastCall[2]).toBe(onClose)
      expect(lastCall[3]).toBe('gal')
    })
  })

  describe('children rendering', () => {
    it('renders children inside lightbox component', () => {
      render(
        <LightboxGallery images={[baseImage()]} lightboxIdentifier="gal">
          <p data-testid="child">Hello</p>
        </LightboxGallery>,
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })

  describe('performance & memoization', () => {
    it('keeps images array reference stable across rerenders with same input', () => {
      const imgs = [baseImage({ ref: 'mem1' }), baseImage({ ref: 'mem2' })]
      const { rerender } = render(<LightboxGallery images={imgs} lightboxIdentifier="gal" />)
      const firstCall = mockSlideshow.mock.calls[mockSlideshow.mock.calls.length - 1][0]
      const firstImagesRef = firstCall.images
      // Re-render with the exact same array reference
      rerender(<LightboxGallery images={imgs} lightboxIdentifier="gal" />)
      const secondCall = mockSlideshow.mock.calls[mockSlideshow.mock.calls.length - 1][0]
      const secondImagesRef = secondCall.images
      expect(secondImagesRef).toBe(firstImagesRef)
    })
  })
})
