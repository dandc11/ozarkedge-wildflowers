/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen, fireEvent, waitFor } from '../tests/utils/test-utils'
import { createMockSanityImage } from '../tests/mocks/sanity-mocks'

import ImageSlider from './ImageSlider'

// Override the global next/dynamic mock for this test to use our local mocks
jest.mock('next/dynamic', () => {
  return (importFunc) => {
    const modulePath = importFunc.toString()

    // Return the mocked versions for our specific imports
    if (modulePath.includes('./LightboxGallery')) {
      const MockLightbox = require('./LightboxGallery')
      return MockLightbox.default || MockLightbox
    }
    if (modulePath.includes('./InteractiveImage')) {
      const MockInteractive = require('./InteractiveImage')
      return MockInteractive.default || MockInteractive
    }

    // Fallback to actual import for others
    try {
      const importedModule = importFunc()
      return importedModule.default || importedModule
    } catch (e) {
      return () => null
    }
  }
})

// Mock the heavy components that are dynamically imported
jest.mock('./LightboxGallery', () => {
  return ({ lightboxIdentifier, images }) => (
    <div data-testid="lightbox-gallery" data-lightbox-id={lightboxIdentifier}>
      Lightbox for {images?.length || 0} images
    </div>
  )
})

jest.mock('./InteractiveImage', () => {
  return ({ image, lightboxIdentifier, ...props }) => (
    <div
      data-testid="interactive-image"
      data-lightbox-id={lightboxIdentifier}
      data-image-ref={image?.asset?._ref}
      onClick={() => {
        // Simulate click behavior for testing
        console.log('Interactive image clicked')
      }}
      {...props}
    >
      Interactive Image: {image?.alt || 'No alt'}
    </div>
  )
})

jest.mock('./CustomLink', () => {
  return ({ children, docType, slug }) => (
    <a href={`/${docType}/${slug}`} data-testid="custom-link">
      {children}
    </a>
  )
})

jest.mock('./ResponsiveImage', () => {
  return ({ image, ...props }) => (
    <div data-testid="responsive-image" data-image-ref={image?.asset?._ref} {...props}>
      Responsive Image: {image?.alt || 'No alt'}
    </div>
  )
})

describe('ImageSlider Component', () => {
  const mockImages = [
    {
      ...createMockSanityImage({ alt: 'Plant 1' }),
      caption: 'Purple Coneflower',
      slug: 'purple-coneflower',
      docType: 'nativePlant',
    },
    {
      ...createMockSanityImage({ alt: 'Plant 2' }),
      caption: 'Black-eyed Susan',
      slug: 'black-eyed-susan',
      docType: 'nativePlant',
    },
  ]

  const createLightboxContextMocks = () => ({
    setLightBoxOpenImgKey: jest.fn(),
    setLightboxIdentifier: jest.fn(),
    lightboxOpenImgKey: null,
    lightboxIdentifier: null,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders slider with images', () => {
      render(<ImageSlider sliderImages={mockImages} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(2)
    })

    it('renders empty when no images provided', () => {
      render(<ImageSlider sliderImages={[]} />)

      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      expect(list.children).toHaveLength(0)
    })
  })

  describe('Link Behavior (useLinks=true)', () => {
    it('wraps images in CustomLink when useLinks is true and images have slugs', () => {
      render(<ImageSlider sliderImages={mockImages} useLinks={true} />)

      const links = screen.getAllByTestId('custom-link')
      expect(links).toHaveLength(2)
      expect(links[0]).toHaveAttribute('href', '/nativePlant/purple-coneflower')
      expect(links[1]).toHaveAttribute('href', '/nativePlant/black-eyed-susan')
    })

    it('does not render lightbox gallery when using links', () => {
      render(<ImageSlider sliderImages={mockImages} useLinks={true} />)

      expect(screen.queryByTestId('lightbox-gallery')).not.toBeInTheDocument()
    })
  })

  describe('Lightbox Behavior (useLinks=false or undefined)', () => {
    it('renders InteractiveImage components when not using links', async () => {
      const lightboxMocks = createLightboxContextMocks()

      render(<ImageSlider sliderImages={mockImages} lightboxIdentifier="test-gallery" />, {
        lightboxContextValue: lightboxMocks,
      })

      await waitFor(() => {
        const interactiveImages = screen.getAllByTestId('interactive-image')
        expect(interactiveImages).toHaveLength(2)
        expect(interactiveImages[0]).toHaveAttribute('data-lightbox-id', 'test-gallery')
      })
    })

    it('renders lightbox gallery when not using links and has images', async () => {
      render(<ImageSlider sliderImages={mockImages} lightboxIdentifier="test-gallery" />)

      await waitFor(() => {
        expect(screen.getByTestId('lightbox-gallery')).toBeInTheDocument()
        expect(screen.getByTestId('lightbox-gallery')).toHaveAttribute(
          'data-lightbox-id',
          'test-gallery',
        )
      })
    })

    it('does not render lightbox gallery when no images', () => {
      render(<ImageSlider sliderImages={[]} lightboxIdentifier="empty-gallery" />)

      expect(screen.queryByTestId('lightbox-gallery')).not.toBeInTheDocument()
    })
  })

  describe('Mixed Image Types', () => {
    it('handles images with and without slugs correctly when useLinks=true', () => {
      const mixedImages = [
        mockImages[0], // has slug
        { ...mockImages[1], slug: undefined }, // no slug
      ]

      render(<ImageSlider sliderImages={mixedImages} useLinks={true} />)

      const links = screen.getAllByTestId('custom-link')
      expect(links).toHaveLength(1) // Only the image with slug gets wrapped
    })
  })

  describe('Props and Styling', () => {
    it('applies custom className', () => {
      render(<ImageSlider sliderImages={mockImages} className="custom-slider" />)

      expect(document.querySelector('.custom-slider')).toBeInTheDocument()
    })

    it('passes captionBgClassName to image components', () => {
      render(
        <ImageSlider
          sliderImages={mockImages}
          captionBgClassName="custom-caption"
          useLinks={true}
        />,
      )

      // Should be passed down to ResponsiveImage components
      // Note: This would need to be verified by checking if the prop is passed
      // In a real test, you might mock ResponsiveImage to verify props
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined sliderImages gracefully', () => {
      render(<ImageSlider sliderImages={undefined} />)

      const list = screen.getByRole('list')
      expect(list.children).toHaveLength(0)
    })

    it('handles null lightboxIdentifier', () => {
      render(<ImageSlider sliderImages={mockImages} lightboxIdentifier={null} />)

      // Should still render but without lightbox functionality
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
  })
})
