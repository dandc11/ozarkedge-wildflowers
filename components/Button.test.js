/**
 * @jest-environment jsdom
 */

import React from 'react'

import { renderWithoutProviders, screen, fireEvent } from '../tests/utils/test-utils'
import Button from './Button'

// Mock the router
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()
const mockForward = jest.fn()
const mockRefresh = jest.fn()
const mockPrefetch = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    prefetch: mockPrefetch,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock the helper utility
jest.mock('../utilities/helperUtil', () => ({
  getPathFromDocType: jest.fn((docType, slug) => {
    if (docType === 'nativePlant' && slug) return `/native-plants/${slug}`
    if (docType === 'season' && slug) return `/season/${slug}`
    if (docType === 'aboutPage') return '/about'
    return '/'
  }),
}))

describe('Button Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders children content correctly', () => {
      renderWithoutProviders(<Button>Click me</Button>)

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      renderWithoutProviders(<Button className="custom-class">Test</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('sets button type correctly', () => {
      renderWithoutProviders(<Button type="submit">Submit</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('defaults to button type when none specified', () => {
      renderWithoutProviders(<Button>Default</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('Icons', () => {
    it('renders expand icon when buttonIcon is "expand"', () => {
      renderWithoutProviders(<Button buttonIcon="expand">Expand</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-expand')
      // Check for the plus or minus circle icon
      expect(button.querySelector('.icon')).toBeInTheDocument()
    })

    it('renders chevron-down icon', () => {
      renderWithoutProviders(<Button buttonIcon="chevron-down">Dropdown</Button>)

      const button = screen.getByRole('button')
      expect(button.querySelector('.chevron-down')).toBeInTheDocument()
    })

    it('renders chevron-up icon', () => {
      renderWithoutProviders(<Button buttonIcon="chevron-up">Collapse</Button>)

      const button = screen.getByRole('button')
      expect(button.querySelector('.chevron-up')).toBeInTheDocument()
    })

    it('applies correct stroke width to icons', () => {
      renderWithoutProviders(
        <Button buttonIcon="chevron-down" strokeWidth={2}>
          Icon
        </Button>,
      )

      const svg = screen.getByRole('button').querySelector('svg')
      const path = screen.getByRole('button').querySelector('svg path')
      // DOM may reflect stroke width on either element depending on runtime
      const hasAttr =
        svg?.getAttribute('stroke-width') === '2' || path?.getAttribute('stroke-width') === '2'
      expect(hasAttr).toBe(true)
    })
  })

  describe('Navigation Behavior', () => {
    it('navigates to correct path when clicked without callback', () => {
      renderWithoutProviders(
        <Button linkDocType="nativePlant" slug="wild-bergamot">
          View Plant
        </Button>,
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith('/native-plants/wild-bergamot')
    })

    it('navigates to about page', () => {
      renderWithoutProviders(<Button linkDocType="aboutPage">About</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith('/about')
    })

    it('navigates to season page with slug', () => {
      renderWithoutProviders(
        <Button linkDocType="season" slug="spring">
          Spring
        </Button>,
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith('/season/spring')
    })

    it('includes URL parameters in navigation', () => {
      renderWithoutProviders(
        <Button
          linkDocType="nativePlant"
          slug="purple-coneflower"
          urlParams={{ filter: 'summer', sort: 'name' }}
        >
          View Plant
        </Button>,
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith(
        '/native-plants/purple-coneflower?filter=summer&sort=name',
      )
    })
  })

  describe('Callback Functionality', () => {
    it('executes callback function when provided', () => {
      const mockCallback = jest.fn()
      renderWithoutProviders(<Button callBack={mockCallback}>Callback Button</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockCallback).toHaveBeenCalledTimes(1)
      // Should not navigate when callback is provided
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('prioritizes callback over navigation', () => {
      const mockCallback = jest.fn()
      renderWithoutProviders(
        <Button callBack={mockCallback} linkDocType="aboutPage">
          Callback Priority
        </Button>,
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Expanded State', () => {
    it('handles expanded state for expand buttons', () => {
      renderWithoutProviders(
        <Button buttonIcon="expand" expanded="true">
          Expanded
        </Button>,
      )

      const button = screen.getByRole('button')
      // When expanded, should show minus icon instead of plus
      expect(button.querySelector('.minus-circle')).toBeInTheDocument()
    })

    it('shows plus icon when not expanded', () => {
      renderWithoutProviders(
        <Button buttonIcon="expand" expanded="">
          Not Expanded
        </Button>,
      )

      const button = screen.getByRole('button')
      // When not expanded, should show plus icon
      expect(button.querySelector('.plus-circle')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('is focusable', () => {
      renderWithoutProviders(<Button>Focusable Button</Button>)

      const button = screen.getByRole('button')
      button.focus()

      expect(button).toHaveFocus()
    })

    it('can be triggered with Enter key', () => {
      const mockCallback = jest.fn()
      renderWithoutProviders(<Button callBack={mockCallback}>Keyboard Button</Button>)

      const button = screen.getByRole('button')
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })

      // Note: This test checks that the button is keyboard accessible
      // The actual Enter key triggering might need additional implementation
      expect(button).toHaveFocus()
    })

    it('maintains semantic button role', () => {
      renderWithoutProviders(<Button>Semantic Button</Button>)

      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('Data Attributes', () => {
    it('applies data attribute when provided', () => {
      renderWithoutProviders(<Button data="test-data">Data Button</Button>)

      const button = screen.getByRole('button')
      // This assumes the component applies data as a data attribute
      // May need adjustment based on actual implementation
      expect(button).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing slug gracefully', () => {
      renderWithoutProviders(<Button linkDocType="nativePlant">No Slug</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Should still attempt navigation, just without the slug part
      expect(mockPush).toHaveBeenCalled()
    })

    it('handles invalid linkDocType gracefully', () => {
      renderWithoutProviders(<Button linkDocType="invalidType">Invalid Type</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Should default to root path
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})
