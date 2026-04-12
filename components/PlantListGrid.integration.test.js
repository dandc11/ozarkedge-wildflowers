/**
 * @jest-environment jsdom
 */

import React from 'react'

import {
  renderWithoutProviders as render,
  screen,
  fireEvent,
  waitFor,
} from '../tests/utils/test-utils'
import { mockNativePlantData } from '../tests/mocks/sanity-mocks'

import PlantListGrid from './PlantListGrid'

// --- Mocks ---
// Animated components from react-select; return a noop components map
jest.mock('react-select/animated', () => () => ({}))

// stegaClean passthrough
jest.mock('next-sanity', () => ({ stegaClean: (v) => v }))

// Keep react-select real via PlantListFieldset import; mock heavy child components to simplify DOM
jest.mock('./CustomLink', () => ({ children }) => <>{children}</>)

jest.mock('./PlantImageCard', () => (props) => {
  const { plantName } = props || {}
  const label = `${plantName?.commonName || ''} | ${plantName?.botanicalName || ''}`
  return (
    <div data-testid="plant-card" aria-label={label}>
      {label}
    </div>
  )
})

jest.mock('./PortTextWrapper', () => ({ children }) => <div data-testid="port-text" />)

// Mock Button to be a simple clickable that respects callBack
jest.mock('./Button', () => ({ children, callBack = () => {}, ...rest }) => (
  <button type="button" onClick={callBack} {...rest}>
    {children}
  </button>
))

// Mock next/navigation search params with a configurable query string
let queryString = ''
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(queryString),
}))

// Utility: build plants with overrides to cover filters
const makePlant = (overrides = {}) => ({
  ...JSON.parse(JSON.stringify(mockNativePlantData)),
  _id: overrides._id || `plant-${Math.random().toString(36).slice(2, 8)}`,
  slug: {
    _type: 'slug',
    current: overrides.slug || `plant-${Math.random().toString(36).slice(2, 8)}`,
  },
  plantName: {
    _type: 'plantName',
    commonName: overrides.commonName ? [overrides.commonName] : ['Blue sage'],
    botanicalName: overrides.botanicalName
      ? [overrides.botanicalName]
      : ['Salvia azurea var. grandiflora'],
  },
  flowerColor: overrides.flowerColor || ['blue'],
  floweringMonths: overrides.floweringMonths || [7, 8],
  habitatType: overrides.habitatType || ['Glade'],
  previewImage: { ...(mockNativePlantData.previewImage || {}), ...(overrides.previewImage || {}) },
})

const renderGrid = (plants, pageData = { _id: 'page', plantListInformation: [] }) =>
  render(
    <PlantListGrid
      nativePlantList={plants}
      nativePlantPageData={pageData}
      plantListInformation={pageData.plantListInformation}
    />,
  )

const openMenu = async (label) => {
  const combobox = screen.getByLabelText(label)
  await fireEvent.keyDown(combobox, { key: 'ArrowDown' })
  return combobox
}

const selectOption = async (text) => {
  const opt = await screen.findByText(text)
  fireEvent.click(opt)
}

describe('PlantListGrid integration', () => {
  beforeEach(() => {
    queryString = ''
  })

  it('renders all plants initially (no filters)', () => {
    const plants = [
      makePlant({ commonName: 'Blue sage', botanicalName: 'Salvia azurea', flowerColor: ['blue'] }),
      makePlant({
        commonName: 'Purple coneflower',
        botanicalName: 'Echinacea purpurea',
        flowerColor: ['purple'],
      }),
      makePlant({
        commonName: 'Yellow coneflower',
        botanicalName: 'Ratibida pinnata',
        flowerColor: ['yellow'],
        habitatType: ['Grassland/Prairie'],
      }),
      makePlant({
        commonName: 'Glade milkweed',
        botanicalName: 'Asclepias stenophylla',
        flowerColor: ['green'],
        habitatType: ['Glade'],
      }),
      makePlant({
        commonName: 'Prairie blazing star',
        botanicalName: 'Liatris pycnostachya',
        flowerColor: ['purple'],
        habitatType: ['Grassland/Prairie'],
        floweringMonths: [8, 9],
      }),
    ]

    renderGrid(plants)

    const cards = screen.getAllByTestId('plant-card')
    expect(cards).toHaveLength(5)
  })

  it('filters by flower color via Fieldset', async () => {
    const plants = [
      makePlant({ commonName: 'Blue sage', flowerColor: ['blue'] }),
      makePlant({ commonName: 'Purple coneflower', flowerColor: ['purple'] }),
      makePlant({ commonName: 'Blue lobelia', flowerColor: ['blue'] }),
    ]

    renderGrid(plants)

    await openMenu(/flower color/i)
    await selectOption('Blue')

    // Wait for rerender after selection
    await waitFor(() => {
      expect(screen.getAllByTestId('plant-card')).toHaveLength(2)
    })
    const names = screen.getAllByTestId('plant-card').map((el) => el.getAttribute('aria-label'))
    expect(names).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/blue sage/i),
        expect.stringMatching(/blue lobelia/i),
      ]),
    )
  })

  it('filters by habitat', async () => {
    const plants = [
      makePlant({ commonName: 'Glade plant', habitatType: ['Glade'] }),
      makePlant({ commonName: 'Prairie plant', habitatType: ['Grassland/Prairie'] }),
    ]

    renderGrid(plants)

    await openMenu(/habitat/i)
    await selectOption('Glade')

    const cards = screen.getAllByTestId('plant-card')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveAccessibleName(/glade plant/i)
  })

  it('filters by name (common or botanical)', async () => {
    const plants = [
      makePlant({ commonName: 'Blue sage', botanicalName: 'Salvia azurea' }),
      makePlant({ commonName: 'Purple coneflower', botanicalName: 'Echinacea purpurea' }),
    ]

    renderGrid(plants)

    await openMenu(/common or botanical name/i)
    await selectOption('Purple coneflower')

    const cards = screen.getAllByTestId('plant-card')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveAccessibleName(/purple coneflower/i)
  })

  it('initializes filters from URL params (months, names, colors)', async () => {
    const plants = [
      makePlant({ commonName: 'July Blue', flowerColor: ['blue'], floweringMonths: [7] }),
      makePlant({ commonName: 'August Yellow', flowerColor: ['yellow'], floweringMonths: [8] }),
      makePlant({ commonName: 'July Purple', flowerColor: ['purple'], floweringMonths: [7] }),
    ]

    // Only keep July and color blue, and name "July Blue"
    queryString = 'months=7&names=July%20Blue&colors=blue'

    renderGrid(plants)

    // Should be 1 card after initialization
    const cards = screen.getAllByTestId('plant-card')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveAccessibleName(/july blue/i)
  })

  it('supports Show more to reveal beyond initial 30', () => {
    const manyPlants = Array.from({ length: 35 }, (_, i) =>
      makePlant({
        commonName: `Plant ${i + 1}`,
        botanicalName: `Species ${i + 1}`,
        slug: `plant-${i + 1}`,
      }),
    )

    renderGrid(manyPlants)

    // Initially 30 are shown
    let cards = screen.getAllByTestId('plant-card')
    expect(cards).toHaveLength(30)

    // Click any "Show more" button; either fieldset or grid increases count by 20
    const showMoreButton = screen.getAllByRole('button', { name: /show more/i })[0]
    fireEvent.click(showMoreButton)

    cards = screen.getAllByTestId('plant-card')
    expect(cards).toHaveLength(35)
  })

  it('applies combined filters (color + habitat + month) with AND logic', async () => {
    const plants = [
      makePlant({
        commonName: 'Target Blue Glade July',
        flowerColor: ['blue'],
        habitatType: ['Glade'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Blue Prairie July',
        flowerColor: ['blue'],
        habitatType: ['Grassland/Prairie'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Yellow Glade July',
        flowerColor: ['yellow'],
        habitatType: ['Glade'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Blue Glade August',
        flowerColor: ['blue'],
        habitatType: ['Glade'],
        floweringMonths: [8],
      }),
    ]

    renderGrid(plants)

    // Color: Blue
    await openMenu(/flower color/i)
    await selectOption('Blue')

    // Habitat: Glade
    await openMenu(/habitat/i)
    await selectOption('Glade')

    // Month: July
    await openMenu(/flowering month/i)
    await selectOption('July')

    // Expect only the target plant remains
    await waitFor(() => {
      expect(screen.getAllByTestId('plant-card')).toHaveLength(1)
    })
    expect(screen.getByTestId('plant-card')).toHaveAccessibleName(/target blue glade july/i)
  })

  it('combined filters work regardless of selection order (month → color → habitat)', async () => {
    const plants = [
      makePlant({
        commonName: 'Target Blue Glade July',
        flowerColor: ['blue'],
        habitatType: ['Glade'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Blue Prairie July',
        flowerColor: ['blue'],
        habitatType: ['Grassland/Prairie'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Yellow Glade July',
        flowerColor: ['yellow'],
        habitatType: ['Glade'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Blue Glade August',
        flowerColor: ['blue'],
        habitatType: ['Glade'],
        floweringMonths: [8],
      }),
    ]

    renderGrid(plants)

    // Month first
    await openMenu(/flowering month/i)
    await selectOption('July')

    // Color second
    await openMenu(/flower color/i)
    await selectOption('Blue')

    // Habitat last
    await openMenu(/habitat/i)
    await selectOption('Glade')

    await waitFor(() => {
      expect(screen.getAllByTestId('plant-card')).toHaveLength(1)
    })
    expect(screen.getByTestId('plant-card')).toHaveAccessibleName(/target blue glade july/i)
  })

  it('updates count text and wording from plants → matches after filtering', async () => {
    const plants = [
      makePlant({ commonName: 'Blue sage', flowerColor: ['blue'] }),
      makePlant({ commonName: 'Blue lobelia', flowerColor: ['blue'] }),
      makePlant({ commonName: 'Purple coneflower', flowerColor: ['purple'] }),
    ]

    renderGrid(plants)

    // Initial count: Showing 30 of 3 plants (but our component clamps to min(max, filteredCount))
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 3 of 3 plants')

    // Apply color filter: Blue → 2 results
    await openMenu(/flower color/i)
    await selectOption('Blue')

    await waitFor(() => {
      expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 2 of 2 matches')
    })
  })

  it('supports multi-value filters (OR within a filter, AND across groups)', async () => {
    const plants = [
      makePlant({
        commonName: 'Blue Glade July',
        flowerColor: ['blue'],
        habitatType: ['Glade'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Purple Glade July',
        flowerColor: ['purple'],
        habitatType: ['Glade'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Yellow Glade July',
        flowerColor: ['yellow'],
        habitatType: ['Glade'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Blue Prairie July',
        flowerColor: ['blue'],
        habitatType: ['Grassland/Prairie'],
        floweringMonths: [7],
      }),
      makePlant({
        commonName: 'Blue Glade August',
        flowerColor: ['blue'],
        habitatType: ['Glade'],
        floweringMonths: [8],
      }),
    ]

    renderGrid(plants)

    // Colors: Blue + Purple (OR)
    await openMenu(/flower color/i)
    await selectOption('Blue')
    await openMenu(/flower color/i)
    await selectOption('Purple')

    // Habitat: Glade (AND)
    await openMenu(/habitat/i)
    await selectOption('Glade')

    // Months: July + August (OR)
    await openMenu(/flowering month/i)
    await selectOption('July')
    await openMenu(/flowering month/i)
    await selectOption('August')

    // Expected results: Blue Glade July, Purple Glade July, Blue Glade August → total 3
    await waitFor(() => {
      expect(screen.getAllByTestId('plant-card')).toHaveLength(3)
    })
    const names = screen.getAllByTestId('plant-card').map((el) => el.getAttribute('aria-label'))
    expect(names).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/blue glade july/i),
        expect.stringMatching(/purple glade july/i),
        expect.stringMatching(/blue glade august/i),
      ]),
    )
  })

  it('clearing filters restores full results and count text', async () => {
    const plants = [
      makePlant({ commonName: 'Blue A', flowerColor: ['blue'] }),
      makePlant({ commonName: 'Blue B', flowerColor: ['blue'] }),
      makePlant({ commonName: 'Purple P', flowerColor: ['purple'] }),
    ]

    renderGrid(plants)

    // Initially 3 plants, "plants" wording
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 3 of 3 plants')

    // Filter by Blue
    await openMenu(/flower color/i)
    await selectOption('Blue')

    await waitFor(() => {
      expect(screen.getAllByTestId('plant-card')).toHaveLength(2)
      expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 2 of 2 matches')
    })

    // Clear by removing the selected chip
    const removeBlue = screen.getByRole('button', { name: /remove blue/i })
    fireEvent.click(removeBlue)

    await waitFor(() => {
      expect(screen.getAllByTestId('plant-card')).toHaveLength(3)
      expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 3 of 3 plants')
    })
  })

  it('initializes multiple values from URL params (colors=blue,purple & months=7,8)', async () => {
    const plants = [
      makePlant({ commonName: 'Blue July', flowerColor: ['blue'], floweringMonths: [7] }),
      makePlant({ commonName: 'Purple August', flowerColor: ['purple'], floweringMonths: [8] }),
      makePlant({ commonName: 'Purple July', flowerColor: ['purple'], floweringMonths: [7] }),
      makePlant({ commonName: 'Yellow July', flowerColor: ['yellow'], floweringMonths: [7] }),
      makePlant({ commonName: 'Blue September', flowerColor: ['blue'], floweringMonths: [9] }),
    ]

    // Colors: blue or purple; Months: 7 or 8
    queryString = 'months=7,8&colors=blue,purple'

    renderGrid(plants)

    await waitFor(() => {
      expect(screen.getAllByTestId('plant-card')).toHaveLength(3)
      expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 3 of 3 matches')
    })

    const names = screen.getAllByTestId('plant-card').map((el) => el.getAttribute('aria-label'))
    expect(names).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/blue july/i),
        expect.stringMatching(/purple august/i),
        expect.stringMatching(/purple july/i),
      ]),
    )
  })
})
