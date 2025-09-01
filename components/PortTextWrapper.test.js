/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen, fireEvent } from '../tests/utils/test-utils'
import {
  mockBasicPortableText,
  mockPortableTextWithFigure,
  mockPortableTextWithImageCollection,
  mockPortableTextWithVideo,
} from '../tests/mocks/sanity-mocks'

import PortTextWrapper from './PortTextWrapper'

// Mock next/link to simplify testing internal links
jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...rest }) => (
    <a href={href} data-testid="next-link" {...rest}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock child components we only need presence assertions for
jest.mock('./PortTextFigure', () => {
  return ({ portTextProps, lightboxIdentifier }) => (
    <div data-testid="port-text-figure" data-lightbox-id={lightboxIdentifier}>
      Figure Component
    </div>
  )
})

jest.mock('./PortTextVideo', () => {
  return ({ portTextProps }) => <div data-testid="port-text-video">Video Component</div>
})

jest.mock('./PortTextTeaser', () => {
  return ({ portTextProps }) => (
    <div data-testid="port-text-teaser" data-title={portTextProps?.titleText}>
      Teaser Component
    </div>
  )
})

jest.mock('./ThumbnailGrid', () => {
  return ({ assets = [], onClick, lightboxIdentifier }) => (
    <ul data-testid="thumbnail-grid">
      {assets.map((img) => (
        <li key={img._key || img.asset?._ref || Math.random().toString()}>
          <button
            data-testid="thumbnail"
            data-key={img.asset?._ref}
            onClick={() => onClick?.(img.asset?._ref)}
          >
            Thumb
          </button>
        </li>
      ))}
    </ul>
  )
})

// Helper to wrap provided portable text array
const wrapValue = (val) => (Array.isArray(val) ? val : [val])

// Silence specific console errors that we're expecting
beforeAll(() => {
  const originalError = console.error
  console.error = (...args) => {
    if (
      args[0]?.includes('Warning: Each child in a list should have a unique "key" prop') ||
      args[0]?.includes('Warning: Unknown block type') ||
      args[0]?.includes('Warning: React does not recognize the')
    ) {
      return
    }
    originalError(...args)
  }
})

describe('PortTextWrapper - Render Tests', () => {
  test('renders with valid basic portable text', () => {
    render(<PortTextWrapper value={mockBasicPortableText} />)
    expect(screen.getByText(/Bloom text test/i)).toBeInTheDocument()
  })

  test('renders with empty portable text array without crashing', () => {
    render(<PortTextWrapper value={[]} />)
    expect(document.querySelectorAll('.port-text').length).toBeGreaterThan(0)
  })
})

describe('PortTextWrapper - Component Integration', () => {
  test('renders h2, h3, h4 block types when provided', () => {
    const blocks = [
      {
        _key: '1',
        _type: 'block',
        style: 'h2',
        children: [{ _key: '1a', _type: 'span', text: 'Heading 2', marks: [] }],
        markDefs: [],
      },
      {
        _key: '2',
        _type: 'block',
        style: 'h3',
        children: [{ _key: '2a', _type: 'span', text: 'Heading 3', marks: [] }],
        markDefs: [],
      },
      {
        _key: '3',
        _type: 'block',
        style: 'h4',
        children: [{ _key: '3a', _type: 'span', text: 'Heading 4', marks: [] }],
        markDefs: [],
      },
    ]
    render(<PortTextWrapper value={blocks} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Heading 2' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Heading 3' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Heading 4' })).toBeInTheDocument()
  })

  test('renders figure block with PortTextFigure', () => {
    render(<PortTextWrapper value={mockPortableTextWithFigure} />)
    expect(screen.getByTestId('port-text-figure')).toBeInTheDocument()
  })

  test('renders imageCollection block with ThumbnailGrid', () => {
    render(<PortTextWrapper value={mockPortableTextWithImageCollection} />)
    expect(screen.getByTestId('thumbnail-grid')).toBeInTheDocument()
  })

  test('renders portTextVideo block with PortTextVideo', () => {
    render(<PortTextWrapper value={mockPortableTextWithVideo} />)
    expect(screen.getByTestId('port-text-video')).toBeInTheDocument()
  })

  test('renders teaserSection block with correct content', () => {
    const teaserData = {
      _key: 'teaser1',
      _type: 'teaserSection',
      titleText: 'Teaser Title',
      image: { _type: 'image', asset: { _ref: 'image-abc123-2500x1667-jpg' } },
    }

    render(<PortTextWrapper value={[teaserData]} />)
    // Mocked PortTextTeaser only renders a generic placeholder; verify component presence & data attribute mapping
    const teaserEl = screen.getByTestId('port-text-teaser')
    expect(teaserEl).toBeInTheDocument()
    expect(teaserEl.getAttribute('data-title') || teaserEl.getAttribute('data-titletext')).toBe(
      'Teaser Title',
    )
  })
})

describe('PortTextWrapper - Lightbox Functionality', () => {
  test('passes lightboxIdentifier to media blocks', () => {
    render(
      <PortTextWrapper value={mockPortableTextWithImageCollection} lightboxIdentifier="lb-click" />,
    )
    // The mocked ThumbnailGrid does not render the identifier directly, but PortTextFigure does.
    // Ensure the figure receives the identifier prop via our mock assertion above.
    render(<PortTextWrapper value={mockPortableTextWithFigure} lightboxIdentifier="lb-fig" />)
    const fig = screen.getByTestId('port-text-figure')
    expect(fig).toBeInTheDocument()
    expect(fig.getAttribute('data-lightbox-id')).toBe('lb-fig')
  })
})

describe('PortTextWrapper - Error Handling', () => {
  test('does not crash with malformed block (missing children array)', () => {
    const malformed = [{ _key: 'bad1', _type: 'block', style: 'normal' }]
    render(<PortTextWrapper value={malformed} />)
    expect(document.querySelector('.port-text')).toBeInTheDocument()
  })

  test('handles null value prop gracefully', () => {
    // Should not throw when value is null; component currently renders wrapper with PortableText receiving null
    expect(() => render(<PortTextWrapper value={null} />)).not.toThrow()
    // Assert wrapper exists and contains no figure/video nodes (since no content)
    const wrapper = document.querySelector('.port-text')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.querySelector('[data-testid="port-text-figure"]')).toBeNull()
    expect(wrapper.querySelector('[data-testid="port-text-video"]')).toBeNull()
  })
})
