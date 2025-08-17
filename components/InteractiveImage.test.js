/**
 * @jest-environment jsdom
 */

import React from 'react'

import {
  render,
  screen,
  fireEvent,
  renderWithoutProviders,
  createMockSanityImage,
} from '../tests/utils/test-utils'
import InteractiveImage from './InteractiveImage'

// Mock Next.js Image component similar to ResponsiveImage tests
jest.mock('next/image', () => {
  // eslint-disable-next-line react/display-name
  return ({
    src,
    alt,
    className,
    onClick,
    loading,
    sizes,
    width,
    height,
    quality,
    priority,
    fetchPriority, // may be provided by component
    ...props
  }) => {
    const fetchpriority = priority || fetchPriority ? 'high' : 'low'
    return (
      <img
        src={src || 'test-image.jpg'}
        alt={alt || ''}
        className={className}
        onClick={onClick}
        data-testid="next-image"
        loading={loading}
        sizes={sizes}
        width={width}
        height={height}
        quality={quality}
        fetchpriority={fetchpriority}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([key]) =>
              ![
                'blurDataURL',
                'placeholder',
                'onLoad',
                'onError',
                'fetchPriority',
                'priority',
              ].includes(key),
          ),
        )}
      />
    )
  }
})

// Mock Sanity image URL helper (minimal subset used)
jest.mock('../sanity/lib/sanity.image', () => ({
  urlForImage: jest.fn((image, { width, height, quality } = {}) => {
    if (!image?.asset?._ref) return { url: () => '' }
    const base = `https://cdn.sanity.io/images/test/${image.asset._ref}.jpg`
    const params = [
      width ? `w=${width}` : null,
      height ? `h=${height}` : null,
      quality ? `q=${quality}` : null,
    ]
      .filter(Boolean)
      .join('&')
    return { url: () => (params ? `${base}?${params}` : base) }
  }),
}))

describe('InteractiveImage Component', () => {
  const mockImage = createMockSanityImage({ alt: 'Interactive test image' })

  const createLightboxContextMocks = () => ({
    setLightBoxOpenImgKey: jest.fn(),
    setLightboxIdentifier: jest.fn(),
    lightboxOpenImgKey: null,
    lightboxIdentifier: null,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering & Prop Forwarding', () => {
    it('renders image via ResponsiveImage with provided alt', () => {
      render(<InteractiveImage image={mockImage} alt="Alt from prop" />)
      const img = screen.getByTestId('next-image')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('alt', 'Alt from prop')
    })

    it('forwards styling related props (className, wrapperClassName, figureClassName)', () => {
      render(
        <InteractiveImage
          image={mockImage}
          alt="Styled"
          className="custom-img-class"
          wrapperClassName="custom-wrapper"
          figureClassName="custom-figure"
          caption="Caption text"
        />,
      )

      expect(document.querySelector('.custom-wrapper')).toBeInTheDocument()
      const figure = document.querySelector('figure.custom-figure')
      expect(figure).toBeInTheDocument()
      const img = screen.getByTestId('next-image')
      expect(img).toHaveClass('custom-img-class')
      expect(screen.getByText('Caption text')).toBeInTheDocument()
    })

    it('applies lightbox identifier data attribute on figure', () => {
      render(
        <InteractiveImage
          image={mockImage}
          alt="With lightbox id"
          lightboxIdentifier="gallery-42"
        />,
      )
      const figure = document.querySelector('figure')
      expect(figure).toHaveAttribute('data-lightboxjs', 'gallery-42')
    })
  })

  describe('Lightbox Context Integration', () => {
    it('triggers context setters with correct key when clicked and lightboxIdentifier present', () => {
      const lightboxMocks = createLightboxContextMocks()
      render(
        <InteractiveImage image={mockImage} alt="Clickable" lightboxIdentifier="gallery-ctx" />,
        {
          lightboxContextValue: lightboxMocks,
        },
      )

      const figure = document.querySelector('figure')
      fireEvent.click(figure) // click on figure to ensure currentTarget has dataset

      expect(lightboxMocks.setLightBoxOpenImgKey).toHaveBeenCalledTimes(1)
      expect(lightboxMocks.setLightBoxOpenImgKey).toHaveBeenCalledWith(mockImage.asset._ref)
      expect(lightboxMocks.setLightboxIdentifier).toHaveBeenCalledWith('gallery-ctx')
    })

    it('does not call context setters when lightboxIdentifier is absent', () => {
      const lightboxMocks = createLightboxContextMocks()
      render(<InteractiveImage image={mockImage} alt="No gallery" />, {
        lightboxContextValue: lightboxMocks,
      })

      fireEvent.click(document.querySelector('figure'))
      expect(lightboxMocks.setLightBoxOpenImgKey).not.toHaveBeenCalled()
      expect(lightboxMocks.setLightboxIdentifier).not.toHaveBeenCalled()
    })
  })

  describe('Click Handling', () => {
    it('handles click on nested img element (event bubbles to figure)', () => {
      const lightboxMocks = createLightboxContextMocks()
      render(
        <InteractiveImage
          image={mockImage}
          alt="Nested click"
          lightboxIdentifier="gallery-bubble"
        />,
        {
          lightboxContextValue: lightboxMocks,
        },
      )

      const img = screen.getByTestId('next-image')
      fireEvent.click(img)
      expect(lightboxMocks.setLightBoxOpenImgKey).toHaveBeenCalled()
    })
  })

  describe('Console Warnings', () => {
    let warnSpy
    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
      warnSpy.mockRestore()
    })

    it('warns when image lacks id and asset._ref', () => {
      const badImage = { _type: 'image', alt: 'No ref' } // no id or asset._ref
      render(<InteractiveImage image={badImage} alt="No ref" />)
      expect(warnSpy).toHaveBeenCalledWith('Image without an id was used:', badImage)
    })

    it('does not warn for valid image with asset._ref', () => {
      render(<InteractiveImage image={mockImage} alt="Valid" />)
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('renders null gracefully when image missing (ResponsiveImage returns null)', () => {
      const lightboxMocks = createLightboxContextMocks()
      render(<InteractiveImage image={{}} alt="Missing asset" />, {
        lightboxContextValue: lightboxMocks,
      })
      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
    })

    it('throws when rendered without LightboxContext provider (documenting requirement)', () => {
      expect(() =>
        renderWithoutProviders(<InteractiveImage image={mockImage} alt="Err" />),
      ).toThrow()
    })
  })
})
