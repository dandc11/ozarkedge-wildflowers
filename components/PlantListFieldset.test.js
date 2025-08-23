/**
 * @jest-environment jsdom
 */

import React from 'react'

import { renderWithoutProviders as render, screen, fireEvent } from '../tests/utils/test-utils'
import { FLOWER_COLOR_OPTIONS, HABITAT_OPTIONS, MONTH_OPTIONS } from '../utilities/constants'

import PlantListFieldset from './PlantListFieldset'

// react-select renders a combobox with an input inside; helpers below ease interaction
const openMenu = async (label) => {
  const combobox = screen.getByLabelText(label)
  // Use keyboard to open the menu reliably
  await fireEvent.keyDown(combobox, { key: 'ArrowDown' })
  return combobox
}

const selectOption = async (optionText) => {
  const option = await screen.findByText(optionText)
  await fireEvent.click(option)
}

describe('PlantListFieldset', () => {
  const baseProps = (overrides = {}) => ({
    animatedComponents: {},
    nameValue: [],
    nameChangeHandler: jest.fn(),
    nameOptions: [
      { label: 'Blue sage', value: 'Blue sage' },
      { label: 'Salvia azurea var. grandiflora', value: 'Salvia azurea var. grandiflora' },
    ],
    monthsValue: [],
    monthsChangeHandler: jest.fn(),
    colorChangeHandler: jest.fn(),
    habitatChangeHandler: jest.fn(),
    maxItemsDisplayed: 20,
    filteredCount: 42,
    totalCount: 42,
    colorsValue: [],
    habitatsValue: [],
    setMaxItemsDisplayed: jest.fn(),
    totalPlantCount: 100,
    ...overrides,
  })

  it('renders all filter controls with accessible labels', () => {
    render(<PlantListFieldset {...baseProps()} />)

    expect(screen.getByText(/filter plants by/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/common or botanical name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/flowering month/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/flower color/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/habitat/i)).toBeInTheDocument()
  })

  it('shows count text using "plants" when no filters are active', () => {
    render(
      <PlantListFieldset
        {...baseProps({ nameValue: [], monthsValue: [], colorsValue: [], habitatsValue: [] })}
      />,
    )

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 20 of 42 plants')
  })

  it('switches count text to "matches" when any filter is active', () => {
    render(
      <PlantListFieldset
        {...baseProps({ nameValue: [{ label: 'Blue sage', value: 'Blue sage' }] })}
      />,
    )

    expect(screen.getByText(/showing/i)).toHaveTextContent('matches')
  })

  it('renders selected values for name and months when provided', () => {
    render(
      <PlantListFieldset
        {...baseProps({
          nameValue: [
            { label: 'Blue sage', value: 'Blue sage' },
            { label: 'Salvia azurea var. grandiflora', value: 'Salvia azurea var. grandiflora' },
          ],
          monthsValue: [MONTH_OPTIONS.find((o) => o.value === 7)],
        })}
      />,
    )

    // react-select renders chips with the label text
    expect(screen.getByText('Blue sage')).toBeInTheDocument()
    expect(screen.getByText('Salvia azurea var. grandiflora')).toBeInTheDocument()
    expect(screen.getByText('July')).toBeInTheDocument()
  })

  it('invokes change handlers when user selects options', async () => {
    const props = baseProps()
    render(<PlantListFieldset {...props} />)

    // Name select
    await openMenu(/common or botanical name/i)
    await selectOption('Blue sage')
    expect(props.nameChangeHandler).toHaveBeenCalled()

    // Flowering Month
    await openMenu(/flowering month/i)
    await selectOption('July')
    expect(props.monthsChangeHandler).toHaveBeenCalled()

    // Flower Color
    await openMenu(/flower color/i)
    await selectOption(FLOWER_COLOR_OPTIONS[1].label) // Blue
    expect(props.colorChangeHandler).toHaveBeenCalled()

    // Habitat
    await openMenu(/habitat/i)
    await selectOption(HABITAT_OPTIONS[0].label) // Glade
    expect(props.habitatChangeHandler).toHaveBeenCalled()
  })

  it('increments max items when Show more is clicked and hides when all items shown', () => {
    const props = baseProps()
    const { rerender } = render(<PlantListFieldset {...props} />)

    const button = screen.getByRole('button', { name: /show more/i })
    fireEvent.click(button)
    expect(props.setMaxItemsDisplayed).toHaveBeenCalledWith(props.maxItemsDisplayed + 20)

    // When max >= total, button should not render
    rerender(<PlantListFieldset {...baseProps({ maxItemsDisplayed: 100, totalPlantCount: 100 })} />)
    expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument()
  })

  it('handles empty arrays for values without crashing', () => {
    render(
      <PlantListFieldset
        {...baseProps({ nameValue: [], monthsValue: [], colorsValue: [], habitatsValue: [] })}
      />,
    )

    expect(screen.getByLabelText(/common or botanical name/i)).toBeInTheDocument()
  })
})
