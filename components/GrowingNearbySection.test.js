/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '../tests/utils/test-utils'
import { createMockSanityImage } from '../tests/mocks/sanity-mocks'
import GrowingNearbySection from './GrowingNearbySection'

// Shallow mock — exposes useLinks and image slug/docType as data attributes so
// we can assert the contract between GrowingNearbySection and ImageSlider without
// re-testing ImageSlider's own link/lightbox logic.
jest.mock('./ImageSlider', () => {
  return function MockImageSlider({ sliderImages, useLinks, lightboxIdentifier }) {
    return (
      <div
        data-testid="image-slider"
        data-use-links={String(!!useLinks)}
        data-lightbox-id={lightboxIdentifier}
      >
        {sliderImages?.map((img, i) => (
          <div
            key={i}
            data-testid="slider-image"
            data-slug={img.slug || ''}
            data-doc-type={img.docType || ''}
          />
        ))}
      </div>
    )
  }
})

jest.mock('./PortTextWrapper', () => {
  return function MockPortTextWrapper() {
    return <div data-testid="port-text-wrapper" />
  }
})

jest.mock('./Heading', () => {
  return function MockHeading({ children }) {
    return <div>{children}</div>
  }
})

describe('GrowingNearbySection', () => {
  // Mock data matching the shape of growingNearbyPlantList items after the GROQ query:
  // { ...image fields, palette, lqip, slug: slug.current, docType: _type }
  const mockImagesWithSlugs = [
    {
      ...createMockSanityImage({ alt: 'Echinacea pallida' }),
      caption: 'Echinacea pallida',
      slug: 'pale-purple-coneflower-echinacea-pallida',
      docType: 'nativePlant',
    },
    {
      ...createMockSanityImage({ alt: 'Rudbeckia hirta' }),
      caption: 'Rudbeckia hirta',
      slug: 'black-eyed-susan-rudbeckia-hirta',
      docType: 'nativePlant',
    },
  ]

  // Simulates a failed auto-link lookup (e.g. GROQ regression where slug is not resolved)
  const mockImagesWithoutSlugs = [
    {
      ...createMockSanityImage({ alt: 'Unknown plant' }),
      // no slug or docType
    },
  ]

  const mockGrowingNearbyText = [
    {
      _key: 'block-1',
      _type: 'block',
      children: [{ _key: 'span-1', _type: 'span', marks: [], text: 'Growing nearby text' }],
      markDefs: [],
      style: 'normal',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Conditional rendering', () => {
    it('renders nothing when neither images nor text are provided', () => {
      const { container } = render(<GrowingNearbySection />)
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when both images and text are null', () => {
      const { container } = render(
        <GrowingNearbySection growingNearbyPlantImages={null} growingNearbyText={null} />,
      )
      expect(container.firstChild).toBeNull()
    })

    it('renders the image slider when images are provided', () => {
      render(<GrowingNearbySection growingNearbyPlantImages={mockImagesWithSlugs} />)
      expect(screen.getByTestId('image-slider')).toBeInTheDocument()
    })

    it('renders text content but not the slider when only growingNearbyText is provided', () => {
      render(<GrowingNearbySection growingNearbyText={mockGrowingNearbyText} />)
      expect(screen.getByTestId('port-text-wrapper')).toBeInTheDocument()
      expect(screen.queryByTestId('image-slider')).not.toBeInTheDocument()
    })

    it('renders both slider and text when both are provided', () => {
      render(
        <GrowingNearbySection
          growingNearbyPlantImages={mockImagesWithSlugs}
          growingNearbyText={mockGrowingNearbyText}
        />,
      )
      expect(screen.getByTestId('image-slider')).toBeInTheDocument()
      expect(screen.getByTestId('port-text-wrapper')).toBeInTheDocument()
    })
  })

  describe('Auto-linking', () => {
    it('passes useLinks={true} to ImageSlider', () => {
      render(<GrowingNearbySection growingNearbyPlantImages={mockImagesWithSlugs} />)
      expect(screen.getByTestId('image-slider')).toHaveAttribute('data-use-links', 'true')
    })

    it('passes resolved slug and docType from each image to ImageSlider', () => {
      render(<GrowingNearbySection growingNearbyPlantImages={mockImagesWithSlugs} />)
      const sliderImages = screen.getAllByTestId('slider-image')
      expect(sliderImages).toHaveLength(2)
      expect(sliderImages[0]).toHaveAttribute(
        'data-slug',
        'pale-purple-coneflower-echinacea-pallida',
      )
      expect(sliderImages[0]).toHaveAttribute('data-doc-type', 'nativePlant')
      expect(sliderImages[1]).toHaveAttribute('data-slug', 'black-eyed-susan-rudbeckia-hirta')
      expect(sliderImages[1]).toHaveAttribute('data-doc-type', 'nativePlant')
    })

    it('passes images without slug to ImageSlider — fallback to lightbox is handled downstream', () => {
      render(<GrowingNearbySection growingNearbyPlantImages={mockImagesWithoutSlugs} />)
      expect(screen.getByTestId('image-slider')).toBeInTheDocument()
      const sliderImages = screen.getAllByTestId('slider-image')
      expect(sliderImages[0]).toHaveAttribute('data-slug', '')
    })

    it('passes the correct lightboxIdentifier to ImageSlider', () => {
      render(<GrowingNearbySection growingNearbyPlantImages={mockImagesWithSlugs} />)
      expect(screen.getByTestId('image-slider')).toHaveAttribute(
        'data-lightbox-id',
        'growingNearby',
      )
    })
  })
})
