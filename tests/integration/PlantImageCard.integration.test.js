/** @jest-environment jsdom */

import React from 'react'

// eslint-disable-next-line import/order
import { render, screen } from '../utils/test-utils'

// Mock ResponsiveImage to avoid next/image complexity in integration scope
jest.mock('../../components/ResponsiveImage', () => ({
  __esModule: true,
  default: ({ alt }) => <div data-testid="responsive-image">IMAGE:{alt}</div>,
}))

import PlantImageCard from '../../components/PlantImageCard'

describe('PlantImageCard Integration', () => {
  it('renders plant name, months, and habitat', () => {
    render(
      <PlantImageCard
        plantName={{ commonName: ['Wild Bergamot'], botanicalName: ['Monarda fistulosa'] }}
        titleText="Wild Bergamot"
        image={{
          _type: 'image',
          asset: { _ref: 'image-mock-ref-123', _type: 'reference' },
          alt: 'Wild Bergamot',
        }}
        floweringMonths={[5, 6, 7]}
        habitatType={['Prairie', 'Savanna']}
      />,
    )

    expect(screen.getByText('Wild Bergamot')).toBeInTheDocument()
    expect(screen.getByText('Monarda fistulosa')).toBeInTheDocument()
    expect(screen.getByText('May—Jul')).toBeInTheDocument()
    expect(screen.getByText('Prairie, Savanna')).toBeInTheDocument()
    expect(screen.getByTestId('responsive-image')).toHaveTextContent('IMAGE:Wild Bergamot')
  })
})
