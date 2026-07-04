/**
 * @jest-environment jsdom
 */

import React from 'react'

import { renderWithoutProviders, screen } from '../tests/utils/test-utils'
import CuratedShelf from './CuratedShelf'

const mockTools = [
  {
    _id: 'tool-1',
    name: 'Audubon Bird Migration Explorer',
    url: 'https://explorer.audubon.org',
    category: 'birds',
    goodFor: 'Seeing where a species migrates through the year.',
    watchOut: 'Projected ranges may be the wrong habitat entirely.',
    regionTags: ['Ozark Highlands', 'Mid-South'],
  },
  {
    _id: 'tool-2',
    name: 'USFS Forest Ecosystem Atlas',
    url: 'https://forest-atlas.fs.usda.gov',
    category: 'forests',
    goodFor: 'Habitat-suitability projections for eastern trees.',
    watchOut: '',
    regionTags: [],
  },
]

describe('CuratedShelf', () => {
  it('renders nothing when there are no tools', () => {
    const { container } = renderWithoutProviders(<CuratedShelf tools={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders each tool as an external link with safe rel', () => {
    renderWithoutProviders(<CuratedShelf tools={mockTools} />)

    const link = screen.getByRole('link', { name: 'Audubon Bird Migration Explorer' })
    expect(link).toHaveAttribute('href', 'https://explorer.audubon.org')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the honest good-for and watch-out notes', () => {
    renderWithoutProviders(<CuratedShelf tools={mockTools} />)
    expect(screen.getByText(/Seeing where a species migrates/)).toBeInTheDocument()
    expect(screen.getByText(/wrong habitat entirely/)).toBeInTheDocument()
  })

  it('renders region tags when present', () => {
    renderWithoutProviders(<CuratedShelf tools={mockTools} />)
    expect(screen.getByText('Ozark Highlands')).toBeInTheDocument()
    expect(screen.getByText('Mid-South')).toBeInTheDocument()
  })

  it('uses the provided heading', () => {
    renderWithoutProviders(<CuratedShelf tools={mockTools} heading="Curated shelf" />)
    expect(screen.getByRole('heading', { name: 'Curated shelf' })).toBeInTheDocument()
  })
})
