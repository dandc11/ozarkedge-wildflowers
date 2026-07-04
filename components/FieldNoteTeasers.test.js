/**
 * @jest-environment jsdom
 */

import React from 'react'

import { renderWithoutProviders, screen } from '../tests/utils/test-utils'
import FieldNoteTeasers from './FieldNoteTeasers'

// ResponsiveImage pulls in @sanity/image-url (ESM) — stub it, as other component tests do.
jest.mock('./ResponsiveImage', () => {
  const Stub = ({ alt }) => <img alt={alt} data-testid="responsive-image" />
  Stub.displayName = 'ResponsiveImageStub'
  return { __esModule: true, default: Stub }
})

// Render next/link as a plain anchor so we can assert on the resolved href.
jest.mock('next/link', () => {
  const Link = ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  Link.displayName = 'NextLinkMock'
  return { __esModule: true, default: Link }
})

const mockNotes = [
  {
    _id: 'note-1',
    title: 'Spring arrives early on the glades',
    slug: 'spring-arrives-early',
    metaDescription: 'What the first warm weeks look like across the Ozark Highlands.',
    season: { seasonName: 'spring', slug: 'spring' },
    mainImage: {
      asset: { _ref: 'image-abc-800x600-jpg', _type: 'reference' },
      alt: 'A glade in spring',
      lqip: 'data:image/png;base64,abc',
    },
  },
]

describe('FieldNoteTeasers', () => {
  it('renders nothing when there are no notes', () => {
    const { container } = renderWithoutProviders(<FieldNoteTeasers notes={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a teaser with title, excerpt and season', () => {
    renderWithoutProviders(<FieldNoteTeasers notes={mockNotes} />)
    expect(
      screen.getByRole('heading', { name: 'Spring arrives early on the glades' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/first warm weeks/)).toBeInTheDocument()
    expect(screen.getByText('Spring')).toBeInTheDocument()
  })

  it('links each note to its field-note detail route', () => {
    renderWithoutProviders(<FieldNoteTeasers notes={mockNotes} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/a-changing-landscape/field-notes/spring-arrives-early')
  })
})
