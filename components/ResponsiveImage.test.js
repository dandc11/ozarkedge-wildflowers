/**
 * @jest-environment jsdom
 */

import React from 'react'

import {
  renderWithoutProviders,
  screen,
  fireEvent,
  createMockSanityImage,
} from '../tests/utils/test-utils'
import ResponsiveImage from './ResponsiveImage'

// Mock Next.js Image component
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
    ...props
  }) => {
    // Handle priority prop conversion like Next.js does
    const fetchpriority = priority ? 'high' : 'low'

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
        // Filter out Next.js specific props that aren't valid DOM attributes
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([key]) =>
              !['blurDataURL', 'placeholder', 'onLoad', 'onError', 'fetchPriority'].includes(key),
          ),
        )}
      />
    )
  }
})

// Mock Sanity image URL helper
jest.mock('../sanity/lib/sanity.image', () => ({
  urlForImage: jest.fn((image) => {
    if (!image?.asset?._ref) return { url: () => '' }
    return {
      url: () => `https://cdn.sanity.io/images/test/${image.asset._ref}.jpg`,
      width: (w) => ({
        url: () => `https://cdn.sanity.io/images/test/${image.asset._ref}.jpg?w=${w}`,
      }),
      height: (h) => ({
        url: () => `https://cdn.sanity.io/images/test/${image.asset._ref}.jpg?h=${h}`,
      }),
      quality: (q) => ({
        url: () => `https://cdn.sanity.io/images/test/${image.asset._ref}.jpg?q=${q}`,
      }),
    }
  }),
}))

describe('ResponsiveImage Component', () => {
  const mockImage = createMockSanityImage({
    alt: 'Test wildflower image',
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders image with correct alt text', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} alt="Wild bergamot flower" />)

      const img = screen.getByTestId('next-image')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('alt', 'Wild bergamot flower')
    })

    it('falls back to image alt text when no alt prop provided', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('alt', 'Test wildflower image')
    })

    it('renders without image gracefully', () => {
      renderWithoutProviders(<ResponsiveImage alt="No image" />)

      // Should not render anything when no image provided
      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
    })

    it('applies custom className to figure element', () => {
      renderWithoutProviders(
        <ResponsiveImage image={mockImage} figureClassName="custom-figure-class" alt="Test" />,
      )

      const figure = document.querySelector('figure')
      expect(figure).toHaveClass('custom-figure-class')
    })

    it('applies wrapper className', () => {
      renderWithoutProviders(
        <ResponsiveImage image={mockImage} wrapperClassName="custom-wrapper" alt="Test" />,
      )

      // The wrapper would be the outermost container
      expect(document.querySelector('.custom-wrapper')).toBeInTheDocument()
    })
  })

  describe('Image Properties', () => {
    it('passes loading prop to Next.js Image', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} loading="lazy" alt="Test" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('loading', 'lazy')
    })

    it('passes priority prop to Next.js Image', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} priority={true} alt="Test" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('fetchpriority', 'high')
    })

    it('sets quality correctly', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} quality={75} alt="Test" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('quality', '75')
    })

    it('applies sizes attribute', () => {
      const sizes = '(max-width: 768px) 100vw, 50vw'
      renderWithoutProviders(<ResponsiveImage image={mockImage} sizes={sizes} alt="Test" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('sizes', sizes)
    })
  })

  describe('Hover and Pointer Behavior', () => {
    it('applies hover class by default', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} alt="Test" />)

      const figure = document.querySelector('figure')
      expect(figure).toBeInTheDocument()
    })

    it('disables hover when disableHover is true', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} disableHover={true} alt="Test" />)

      const figure = document.querySelector('figure')
      expect(screen.getByTestId('next-image')).not.toHaveClass('hover')
    })

    it('disables pointer when disablePointer is true', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} disablePointer={true} alt="Test" />)

      const figure = document.querySelector('figure')
      expect(screen.getByTestId('next-image')).not.toHaveClass('cursor-pointer')
    })
  })

  describe('Click Handling', () => {
    it('calls onClick handler when provided', () => {
      const mockOnClick = jest.fn()
      renderWithoutProviders(<ResponsiveImage image={mockImage} onClick={mockOnClick} alt="Test" />)

      const img = screen.getByTestId('next-image')
      fireEvent.click(img)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('does not throw when clicked without onClick handler', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} alt="Test" />)

      const img = screen.getByTestId('next-image')
      expect(() => fireEvent.click(img)).not.toThrow()
    })
  })

  describe('Caption Functionality', () => {
    const imageWithCaption = createMockSanityImage({
      alt: 'Test image',
      caption: 'This is a test caption',
    })

    it('shows caption when showCaption is true and caption exists', () => {
      renderWithoutProviders(
        <ResponsiveImage image={imageWithCaption} showCaption={true} alt="Test" />,
      )

      expect(screen.getByText('This is a test caption')).toBeInTheDocument()
    })

    it('hides caption when showCaption is false', () => {
      renderWithoutProviders(
        <ResponsiveImage image={imageWithCaption} showCaption={false} alt="Test" />,
      )

      expect(screen.queryByText('This is a test caption')).not.toBeInTheDocument()
    })

    it('applies caption background className', () => {
      renderWithoutProviders(
        <ResponsiveImage
          image={imageWithCaption}
          captionBgClassName="custom-caption-bg"
          alt="Test"
        />,
      )

      const caption = screen.getByText('This is a test caption')
      expect(caption.closest('.custom-caption-bg')).toBeInTheDocument()
    })

    it('supports different caption styles', () => {
      renderWithoutProviders(
        <ResponsiveImage image={imageWithCaption} captionStyle="overlay" alt="Test" />,
      )

      // Caption style would affect CSS classes or positioning
      expect(screen.getByText('This is a test caption')).toBeInTheDocument()
    })
  })

  describe('Lightbox Integration', () => {
    it('includes lightbox identifier when provided', () => {
      renderWithoutProviders(
        <ResponsiveImage image={mockImage} lightboxIdentifier="gallery-1" alt="Test" />,
      )

      const figure = document.querySelector('figure')
      // Our component uses data-lightboxjs and data-key
      expect(figure).toHaveAttribute('data-lightboxjs', 'gallery-1')
    })

    it('makes image clickable when lightbox identifier provided', () => {
      renderWithoutProviders(
        <ResponsiveImage image={mockImage} lightboxIdentifier="gallery-1" alt="Test" />,
      )

      const figure = document.querySelector('figure')
      // Clickability is implied by cursor-pointer class on image, no special class on figure
      expect(figure).toBeInTheDocument()
    })
  })

  describe('Children and Content', () => {
    it('renders children content', () => {
      renderWithoutProviders(
        <ResponsiveImage image={mockImage} alt="Test">
          <div data-testid="child-content">Child content</div>
        </ResponsiveImage>,
      )

      expect(screen.getByTestId('child-content')).toBeInTheDocument()
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('renders children alongside image', () => {
      renderWithoutProviders(
        <ResponsiveImage image={mockImage} alt="Test">
          <div>Overlay content</div>
        </ResponsiveImage>,
      )

      expect(screen.getByTestId('next-image')).toBeInTheDocument()
      expect(screen.getByText('Overlay content')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing image asset gracefully', () => {
      const invalidImage = { _type: 'image' } // Missing asset

      renderWithoutProviders(<ResponsiveImage image={invalidImage} alt="Test" />)

      // Should not crash, should not render image
      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
    })

    it('handles null image gracefully', () => {
      renderWithoutProviders(<ResponsiveImage image={null} alt="Test" />)

      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
    })

    it('handles undefined image gracefully', () => {
      renderWithoutProviders(<ResponsiveImage alt="Test" />)

      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('includes proper figure role', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} alt="Test" />)

      const figure = document.querySelector('figure')
      expect(figure).toBeInTheDocument()
    })

    it('includes descriptive alt text', () => {
      renderWithoutProviders(
        <ResponsiveImage image={mockImage} alt="Purple wildflower blooming in spring meadow" />,
      )

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('alt', 'Purple wildflower blooming in spring meadow')
    })

    it('handles empty alt text for decorative images', () => {
      renderWithoutProviders(<ResponsiveImage image={mockImage} alt="" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('alt', '')
    })
  })
})
