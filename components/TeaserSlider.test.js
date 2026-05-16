/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '../tests/utils/test-utils'
import { createMockSanityImage } from '../tests/mocks/sanity-mocks'
import TeaserSlider from './TeaserSlider'

// Shallow mock — exposes useLinks, sliderImages slug/docType/caption as data attributes
// so we can assert the contract between TeaserSlider and ImageSlider without
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
            data-caption={img.caption || ''}
          />
        ))}
      </div>
    )
  }
})

jest.mock('./Button', () => {
  return function MockButton({ children }) {
    return <button>{children}</button>
  }
})

jest.mock('./Heading', () => {
  return function MockHeading({ children }) {
    return <div>{children}</div>
  }
})

jest.mock('./ResponsiveImage', () => {
  return function MockResponsiveImage({ image, alt }) {
    return (
      <div data-testid="default-image" data-image-ref={image?.asset?._ref}>
        {alt}
      </div>
    )
  }
})

// Mock time-dependent utilities for deterministic tests
jest.mock('../utilities/helperUtil', () => ({
  getCurrentMonthName: () => 'may',
  getCurrentSeason: () => ({ SEASON_NAME: 'spring' }),
  titleCase: (str) => str.charAt(0).toUpperCase() + str.slice(1),
}))

describe('TeaserSlider', () => {
  const mockDefaultImage = createMockSanityImage({ alt: 'Default season image' })

  // Mock data matching GET_BLOOMING_PLANTS_PREVIEW_IMAGES_QUERY shape:
  // { "image": previewImage { ... }, "caption": plantName.botanicalName[0], "slug": slug.current }
  const mockPlantImages = [
    {
      image: createMockSanityImage({ alt: 'Pale purple coneflower' }),
      caption: 'Echinacea pallida',
      slug: 'pale-purple-coneflower-echinacea-pallida',
    },
    {
      image: createMockSanityImage({ alt: 'Black-eyed Susan' }),
      caption: 'Rudbeckia hirta',
      slug: 'black-eyed-susan-rudbeckia-hirta',
    },
  ]

  const defaultProps = {
    images: mockPlantImages,
    headingChildren: <span>Blooming in May</span>,
    bodyText: 'Season description',
    buttonLinkSlug: 'spring',
    buttonLinkDocType: 'season',
    buttonLinkText: 'Visit our spring page',
    lightboxIdentifier: 'bloomingNow',
    defaultImage: mockDefaultImage,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic rendering', () => {
    it('renders the ImageSlider when plant images are provided', () => {
      render(<TeaserSlider {...defaultProps} />)
      expect(screen.getByTestId('image-slider')).toBeInTheDocument()
    })

    it('renders the default image when images array is empty', () => {
      render(<TeaserSlider {...defaultProps} images={[]} />)
      expect(screen.queryByTestId('image-slider')).not.toBeInTheDocument()
      expect(screen.getByTestId('default-image')).toBeInTheDocument()
    })

    it('renders nothing when images prop is not provided', () => {
      render(
        <TeaserSlider
          headingChildren={<span>Heading</span>}
          bodyText="text"
          lightboxIdentifier="test"
          defaultImage={mockDefaultImage}
        />,
      )
      expect(screen.queryByTestId('image-slider')).not.toBeInTheDocument()
      expect(screen.queryByTestId('default-image')).not.toBeInTheDocument()
    })

    it('excludes plant entries without an image from the slider', () => {
      const imagesWithMissing = [
        ...mockPlantImages,
        { image: null, caption: 'No image plant', slug: 'no-image-plant' },
      ]
      render(<TeaserSlider {...defaultProps} images={imagesWithMissing} />)
      const sliderImages = screen.getAllByTestId('slider-image')
      expect(sliderImages).toHaveLength(2)
    })
  })

  describe('Auto-linking', () => {
    it('passes useLinks={true} to ImageSlider', () => {
      render(<TeaserSlider {...defaultProps} />)
      expect(screen.getByTestId('image-slider')).toHaveAttribute('data-use-links', 'true')
    })

    it('sets slug on each image from plant query data', () => {
      render(<TeaserSlider {...defaultProps} />)
      const sliderImages = screen.getAllByTestId('slider-image')
      expect(sliderImages[0]).toHaveAttribute(
        'data-slug',
        'pale-purple-coneflower-echinacea-pallida',
      )
      expect(sliderImages[1]).toHaveAttribute('data-slug', 'black-eyed-susan-rudbeckia-hirta')
    })

    it('sets docType to nativePlant on each image', () => {
      render(<TeaserSlider {...defaultProps} />)
      const sliderImages = screen.getAllByTestId('slider-image')
      sliderImages.forEach((img) => {
        expect(img).toHaveAttribute('data-doc-type', 'nativePlant')
      })
    })

    it('sets caption to botanical name string — not an array or plantName object', () => {
      render(<TeaserSlider {...defaultProps} />)
      const sliderImages = screen.getAllByTestId('slider-image')
      expect(sliderImages[0]).toHaveAttribute('data-caption', 'Echinacea pallida')
      expect(sliderImages[1]).toHaveAttribute('data-caption', 'Rudbeckia hirta')
    })

    it('passes the correct lightboxIdentifier to ImageSlider', () => {
      render(<TeaserSlider {...defaultProps} />)
      expect(screen.getByTestId('image-slider')).toHaveAttribute('data-lightbox-id', 'bloomingNow')
    })
  })
})
