/**
 * @jest-environment jsdom
 */

import React from 'react'

import { createUser, render, screen, within } from '../tests/utils/test-utils'

import Nav from './Nav'

const mockPush = jest.fn()
let mockPathname = '/'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}))

jest.mock('./ResponsiveImage', () => {
  return function MockResponsiveImage({ wrapperClassName }) {
    return <div data-testid="plant-image" className={wrapperClassName} />
  }
})

const plant = (commonName, slug, extra = {}) => ({
  plantName: { commonName: [commonName], botanicalName: [`${commonName} botanicus`] },
  slug,
  docType: 'nativePlant',
  previewImage: { asset: { _ref: `ref-${slug}` } },
  ...extra,
})

const searchablePlants = [
  { slug: 'indian-pink', commonName: ['indian pink', 'pinkroot'], botanicalName: ['Spigelia'] },
  { slug: 'false-aloe', commonName: ['false aloe'], botanicalName: ['Manfreda virginica'] },
]

const baseProps = {
  menuSettings: null,
  bloomingNow: {
    count: 12,
    plants: [
      plant('Glade onion', 'glade-onion', { floweringMonths: [9, 10, 11] }),
      plant('Rose verbena', 'rose-verbena', { floweringMonths: [10, 11] }),
    ],
  },
  recentlyAdded: [
    plant('Indian pink', 'indian-pink', { addedAt: '2026-10-12T15:00:00Z' }),
    plant('False aloe', 'false-aloe', { addedAt: '2026-10-03T15:00:00Z' }),
    plant('Ozark sunflower', 'ozark-sunflower', { addedAt: '2026-09-28T15:00:00Z' }),
  ],
  searchablePlants,
  monthName: 'October',
  monthNumber: 10,
  currentSeasonName: 'fall',
}

const getResults = () => document.getElementById('nav-search-results')

const openMenu = async (user) => {
  await user.click(screen.getByRole('button', { name: 'Open the main menu' }))
}

describe('Nav', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockPathname = '/'
    window.matchMedia = jest.fn().mockReturnValue({ matches: false })
  })

  describe('link groups', () => {
    it('renders the Explore and Seasons groups with the hard-coded links', () => {
      render(<Nav {...baseProps} />)

      const explore = screen.getByRole('region', { name: 'Explore' })
      expect(within(explore).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
      expect(within(explore).getByRole('link', { name: 'Native wildflowers' })).toHaveAttribute(
        'href',
        '/native-plants',
      )
      expect(within(explore).getByRole('link', { name: 'About Ozarkedge' })).toHaveAttribute(
        'href',
        '/about',
      )

      const seasons = screen.getByRole('region', { name: 'Seasons' })
      const labels = within(seasons)
        .getAllByRole('link')
        .map((link) => link.textContent)
      expect(labels).toEqual(['Spring', 'Summer', 'Autumn', 'Winter'])
      expect(within(seasons).getByRole('link', { name: 'Autumn' })).toHaveAttribute(
        'href',
        '/season/fall',
      )
    })

    it('marks only the current season', () => {
      render(<Nav {...baseProps} currentSeasonName="spring" />)

      expect(screen.getByRole('link', { name: 'Spring' })).toHaveClass('is-current-season')
      expect(screen.getByRole('link', { name: 'Autumn' })).not.toHaveClass('is-current-season')
    })

    it('marks the page the visitor is on', () => {
      mockPathname = '/about'
      render(<Nav {...baseProps} />)

      expect(screen.getByRole('link', { name: 'About Ozarkedge' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
    })
  })

  describe('opening and closing', () => {
    it('toggles aria-expanded and closes when a link is followed', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)

      const button = screen.getByRole('button', { name: 'Open the main menu' })
      expect(button).toHaveAttribute('aria-expanded', 'false')

      await user.click(button)
      expect(screen.getByRole('button', { name: 'Close the main menu' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )

      await user.click(screen.getByRole('link', { name: 'Home' }))
      expect(screen.getByRole('button', { name: 'Open the main menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })

    it('closes on Escape and returns focus to the menu button', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      await user.keyboard('{Escape}')

      const button = screen.getByRole('button', { name: 'Open the main menu' })
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveFocus()
    })

    it('focuses the search field on open only on large screens', async () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true })
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      expect(screen.getByRole('searchbox')).toHaveFocus()
    })

    it('leaves focus alone on small screens', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      expect(screen.getByRole('searchbox')).not.toHaveFocus()
    })
  })

  describe('Blooming now', () => {
    it('lists plants with bloom months and an "All n" link filtered to the month', () => {
      render(<Nav {...baseProps} />)

      const blooming = screen.getByRole('region', { name: /Blooming now/ })
      expect(within(blooming).getByText('Blooming now · October')).toBeInTheDocument()
      expect(within(blooming).getByRole('link', { name: /Glade onion/ })).toHaveAttribute(
        'href',
        '/native-plants/glade-onion',
      )
      expect(within(blooming).getByText('Sep—Nov')).toBeInTheDocument()
      expect(within(blooming).getByText('Oct, Nov')).toBeInTheDocument()
      expect(
        within(blooming).getByRole('link', { name: /All 12.*blooming in October/ }),
      ).toHaveAttribute('href', '/native-plants?months=10')
    })

    it('is hidden when fewer than two plants are blooming', () => {
      render(
        <Nav
          {...baseProps}
          bloomingNow={{ count: 1, plants: [baseProps.bloomingNow.plants[0]] }}
        />,
      )

      expect(screen.queryByRole('region', { name: /Blooming now/ })).not.toBeInTheDocument()
    })

    it('is hidden when there is no blooming data', () => {
      render(<Nav {...baseProps} bloomingNow={undefined} />)

      expect(screen.queryByRole('region', { name: /Blooming now/ })).not.toBeInTheDocument()
    })
  })

  describe('Featured plant', () => {
    const menuSettings = {
      featuredNote: 'A favourite this month',
      featuredPlant: plant('Purple milkweed', 'purple-milkweed'),
    }

    it('shows the plant, its note, and links to the plant page', () => {
      render(<Nav {...baseProps} menuSettings={menuSettings} />)

      const featured = screen.getByRole('region', { name: 'Featured plant' })
      const link = within(featured).getByRole('link')
      expect(link).toHaveAttribute('href', '/native-plants/purple-milkweed')
      expect(link).toHaveTextContent('Purple milkweed')
      expect(link).toHaveTextContent('A favourite this month')
    })

    it('is omitted when no plant is chosen', () => {
      render(<Nav {...baseProps} menuSettings={{ featuredNote: 'orphan note' }} />)

      expect(screen.queryByRole('region', { name: 'Featured plant' })).not.toBeInTheDocument()
      expect(screen.queryByText(/orphan note/)).not.toBeInTheDocument()
    })
  })

  describe('Recently added', () => {
    it('shows each plant as one link with its added date', () => {
      render(<Nav {...baseProps} />)

      const recent = screen.getByRole('region', { name: 'Recently added' })
      const tiles = within(recent).getAllByRole('link', { name: /Indian pink|False aloe|Ozark/ })
      expect(tiles).toHaveLength(3)
      expect(tiles[0]).toHaveAttribute('href', '/native-plants/indian-pink')
      expect(tiles[0]).toHaveTextContent('Oct 12')
      expect(within(recent).getByRole('link', { name: /All plants A–Z/ })).toHaveAttribute(
        'href',
        '/native-plants',
      )
    })

    it('renders nothing when there are no plants', () => {
      render(<Nav {...baseProps} recentlyAdded={[]} />)

      expect(screen.queryByRole('region', { name: 'Recently added' })).not.toBeInTheDocument()
    })
  })

  describe('search', () => {
    it('replaces the link groups with results while searching', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      await user.type(screen.getByRole('searchbox'), 'aloe')

      expect(screen.queryByRole('region', { name: 'Explore' })).not.toBeInTheDocument()
      expect(screen.queryByRole('region', { name: 'Seasons' })).not.toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveTextContent('1 plant found')
      const results = getResults()
      expect(within(results).getByRole('link', { name: /False aloe/ })).toHaveAttribute(
        'href',
        '/native-plants/false-aloe',
      )
    })

    it('shows which alternate name matched', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      await user.type(screen.getByRole('searchbox'), 'pinkroot')

      const results = getResults()
      expect(within(results).getByRole('link', { name: /Indian pink/ })).toHaveTextContent(
        'also called pinkroot',
      )
    })

    it('explains when nothing matches', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      await user.type(screen.getByRole('searchbox'), 'zzz')

      expect(screen.getByRole('status')).toHaveTextContent('No plants found for "zzz"')
      expect(screen.getByText(/Try a common or botanical name/)).toBeInTheDocument()
    })

    it('clears with the X button, restores the links, and refocuses the field', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)
      const field = screen.getByRole('searchbox')
      await user.type(field, 'aloe')

      await user.click(screen.getByRole('button', { name: 'Clear search' }))

      expect(field).toHaveValue('')
      expect(field).toHaveFocus()
      expect(screen.getByRole('region', { name: 'Explore' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    })

    it('uses Escape to clear first, then close', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)
      await user.type(screen.getByRole('searchbox'), 'aloe')

      await user.keyboard('{Escape}')
      expect(screen.getByRole('searchbox')).toHaveValue('')
      expect(screen.getByRole('button', { name: 'Close the main menu' })).toBeInTheDocument()

      await user.keyboard('{Escape}')
      expect(screen.getByRole('button', { name: 'Open the main menu' })).toBeInTheDocument()
    })

    it('opens the top result on Enter and closes the menu', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      await user.type(screen.getByRole('searchbox'), 'pinkroot{Enter}')

      expect(mockPush).toHaveBeenCalledWith('/native-plants/indian-pink')
      expect(screen.getByRole('button', { name: 'Open the main menu' })).toBeInTheDocument()
      expect(screen.getByRole('searchbox')).toHaveValue('')
    })

    it('does nothing on Enter when there are no results', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      await user.type(screen.getByRole('searchbox'), 'zzz{Enter}')

      expect(mockPush).not.toHaveBeenCalled()
    })

    it('keeps the live region mounted and empty before any search', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)

      const status = screen.getByRole('status')
      expect(status).toBeEmptyDOMElement()

      await user.type(screen.getByRole('searchbox'), 'aloe')
      expect(screen.getByRole('status')).toBe(status)
      expect(status).toHaveTextContent('1 plant found')
    })

    it('points aria-controls at the results only while they exist', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)
      const field = screen.getByRole('searchbox')
      expect(field).not.toHaveAttribute('aria-controls')

      await user.type(field, ' ')
      expect(field).not.toHaveAttribute('aria-controls')
      expect(getResults()).toBeNull()

      await user.type(field, 'aloe')
      expect(field).toHaveAttribute('aria-controls', 'nav-search-results')
      expect(getResults()).not.toBeNull()
    })

    it('rounds the placeholder count down to the nearest ten', () => {
      const many = Array.from({ length: 63 }, (_, i) => ({
        slug: `p-${i}`,
        commonName: [`plant ${i}`],
        botanicalName: [`Plantus ${i}`],
      }))
      render(<Nav {...baseProps} searchablePlants={many} />)

      expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', 'Search 60+ plants')
    })
  })

  describe('search keyboard navigation', () => {
    const manyPlants = [
      { slug: 'aster-one', commonName: ['aster one'], botanicalName: ['Symphyotrichum one'] },
      { slug: 'aster-two', commonName: ['aster two'], botanicalName: ['Symphyotrichum two'] },
      { slug: 'aster-three', commonName: ['aster three'], botanicalName: ['Symphyotrichum three'] },
    ]

    const searchFor = async (user, text) => {
      render(<Nav {...baseProps} searchablePlants={manyPlants} />)
      await openMenu(user)
      await user.type(screen.getByRole('searchbox'), text)
      const results = getResults()
      return within(results).getAllByRole('link')
    }

    it('moves from the field into the results with the down arrow', async () => {
      const user = createUser()
      const links = await searchFor(user, 'aster')

      await user.keyboard('{ArrowDown}')

      expect(links[0]).toHaveFocus()
    })

    it('steps through results with the up and down arrows', async () => {
      const user = createUser()
      const links = await searchFor(user, 'aster')

      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(links[1]).toHaveFocus()

      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(links[2]).toHaveFocus()

      await user.keyboard('{ArrowUp}')
      expect(links[1]).toHaveFocus()
    })

    it('jumps to the first and last results with Home and End', async () => {
      const user = createUser()
      const links = await searchFor(user, 'aster')
      await user.keyboard('{ArrowDown}')

      await user.keyboard('{End}')
      expect(links[2]).toHaveFocus()

      await user.keyboard('{Home}')
      expect(links[0]).toHaveFocus()
    })

    it('returns to the field with the up arrow from the first result', async () => {
      const user = createUser()
      await searchFor(user, 'aster')
      await user.keyboard('{ArrowDown}{ArrowUp}')

      expect(screen.getByRole('searchbox')).toHaveFocus()
    })

    it('ignores the down arrow when there is no search text', async () => {
      const user = createUser()
      render(<Nav {...baseProps} />)
      await openMenu(user)
      screen.getByRole('searchbox').focus()

      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('searchbox')).toHaveFocus()
    })

    it('closes the menu after following a result chosen with the keyboard', async () => {
      const user = createUser()
      const links = await searchFor(user, 'aster')
      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(links[1]).toHaveFocus()

      await user.keyboard('{Enter}')

      expect(screen.getByRole('button', { name: 'Open the main menu' })).toBeInTheDocument()
    })
  })
})
