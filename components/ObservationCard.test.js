/**
 * @jest-environment jsdom
 */

import React from 'react'

import { renderWithoutProviders, screen, fireEvent } from '../tests/utils/test-utils'
import ObservationCard from './ObservationCard'

const feature = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [-92.1, 36.2] },
  properties: {
    id: 'inat-1',
    source: 'inat',
    scientificName: 'Monarda fistulosa',
    commonName: 'Wild Bergamot',
    observedOn: '2026-06-01',
    sourceUrl: 'https://www.inaturalist.org/observations/1',
    license: 'cc-by-nc',
    attribution: 'Observed by tester · iNaturalist (CC BY-NC)',
    photoUrl: null,
  },
}

describe('ObservationCard', () => {
  it('returns null when no feature is provided', () => {
    const { container } = renderWithoutProviders(<ObservationCard feature={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the common and scientific names', () => {
    renderWithoutProviders(<ObservationCard feature={feature} />)
    expect(screen.getByText('Wild Bergamot')).toBeInTheDocument()
    expect(screen.getByText('Monarda fistulosa')).toBeInTheDocument()
  })

  it('frames the record as observed and links to the source with safe rel', () => {
    renderWithoutProviders(<ObservationCard feature={feature} />)
    expect(screen.getByText(/Observed here on 2026-06-01/)).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /source record/i })
    expect(link).toHaveAttribute('href', 'https://www.inaturalist.org/observations/1')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows attribution and license', () => {
    renderWithoutProviders(<ObservationCard feature={feature} />)
    expect(screen.getByText(/iNaturalist \(CC BY-NC\) · cc-by-nc/)).toBeInTheDocument()
  })

  it('calls onClose when the close button is pressed', () => {
    const onClose = jest.fn()
    renderWithoutProviders(<ObservationCard feature={feature} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
