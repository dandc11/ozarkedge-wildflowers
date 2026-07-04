/**
 * @jest-environment jsdom
 */

import React from 'react'

import { renderWithoutProviders, screen } from '../tests/utils/test-utils'
import SourcesPanel from './SourcesPanel'

const baseAttributions = [
  { label: 'Basemap', text: '© OpenStreetMap contributors · OpenFreeMap', url: 'https://openfreemap.org' },
  { label: 'Ecoregions', text: 'EPA Level III Ecoregions (Omernik) — public domain' },
]

describe('SourcesPanel', () => {
  it('names the active observation source and links it', () => {
    renderWithoutProviders(
      <SourcesPanel
        activeSourceLabel="iNaturalist"
        activeSourceUrl="https://www.inaturalist.org"
        activeAttribution="Observations by the iNaturalist community (CC BY-NC)"
        baseAttributions={baseAttributions}
      />,
    )

    const link = screen.getByRole('link', {
      name: /iNaturalist community/i,
    })
    expect(link).toHaveAttribute('href', 'https://www.inaturalist.org')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText(/Currently showing observations from/)).toBeInTheDocument()
  })

  it('renders the standing base attributions', () => {
    renderWithoutProviders(<SourcesPanel baseAttributions={baseAttributions} />)
    expect(screen.getByText(/OpenStreetMap contributors/)).toBeInTheDocument()
    expect(screen.getByText(/EPA Level III Ecoregions/)).toBeInTheDocument()
  })

  it('shows the editorial sources note when provided', () => {
    renderWithoutProviders(
      <SourcesPanel baseAttributions={baseAttributions} sourcesNote="This data comes from others." />,
    )
    expect(screen.getByText('This data comes from others.')).toBeInTheDocument()
  })
})
