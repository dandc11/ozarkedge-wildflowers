/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'

import CustomLink from './CustomLink'

// Mock Next.js Link component
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ href, className, scroll, children, ...props }) => (
    <a href={href} className={className} data-scroll={scroll} data-testid="next-link" {...props}>
      {children}
    </a>
  )
})

// Mock the getPathFromDocType utility function
jest.mock('../utilities/helperUtil', () => ({
  getPathFromDocType: jest.fn(),
}))

import { getPathFromDocType } from '../utilities/helperUtil'

describe('CustomLink Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Path Generation', () => {
    it('generates correct path using getPathFromDocType with docType and slug', () => {
      getPathFromDocType.mockReturnValue('/native-plants/wild-bergamot')

      render(
        <CustomLink docType="nativePlant" slug="wild-bergamot">
          Wild Bergamot
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledWith('nativePlant', 'wild-bergamot')

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('href', '/native-plants/wild-bergamot')
    })

    it('generates path with hash fragment when id is provided', () => {
      getPathFromDocType.mockReturnValue('/native-plants/wild-bergamot')

      render(
        <CustomLink docType="nativePlant" slug="wild-bergamot" id="habitat">
          Habitat Section
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledWith('nativePlant', 'wild-bergamot')

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('href', '/native-plants/wild-bergamot#habitat')
    })

    it('handles empty path from getPathFromDocType', () => {
      getPathFromDocType.mockReturnValue('')

      render(
        <CustomLink docType="unknown" slug="test">
          Test Link
        </CustomLink>,
      )

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('href', '')
    })

    it('works without docType when no path generation is needed', () => {
      // When docType is undefined, getPathFromDocType should not be called
      render(<CustomLink slug="test">Test Link</CustomLink>)

      // getPathFromDocType should not be called when docType is falsy
      expect(getPathFromDocType).not.toHaveBeenCalled()

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('href', '')
    })
  })

  describe('Props Handling', () => {
    it('passes className to the Link component', () => {
      getPathFromDocType.mockReturnValue('/season/spring')

      render(
        <CustomLink docType="season" slug="spring" className="custom-link-class">
          Spring Season
        </CustomLink>,
      )

      const link = screen.getByTestId('next-link')
      expect(link).toHaveClass('custom-link-class')
    })

    it('sets scroll prop to true by default', () => {
      getPathFromDocType.mockReturnValue('/test')

      render(
        <CustomLink docType="test" slug="test">
          Test Link
        </CustomLink>,
      )

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('data-scroll', 'true')
    })

    it('sets scroll prop to true (hardcoded in component)', () => {
      getPathFromDocType.mockReturnValue('/test')

      render(
        <CustomLink docType="test" slug="test" scroll={false}>
          Test Link
        </CustomLink>,
      )

      const link = screen.getByTestId('next-link')
      // Component hardcodes scroll={true} regardless of prop value
      expect(link).toHaveAttribute('data-scroll', 'true')
    })
  })

  describe('Content Rendering', () => {
    it('renders children content correctly', () => {
      getPathFromDocType.mockReturnValue('/native-plants/test')

      render(
        <CustomLink docType="nativePlant" slug="test">
          <span>Complex Child Content</span>
        </CustomLink>,
      )

      expect(screen.getByText('Complex Child Content')).toBeInTheDocument()
    })

    it('renders text children', () => {
      getPathFromDocType.mockReturnValue('/test')

      render(
        <CustomLink docType="test" slug="test">
          Simple Text Link
        </CustomLink>,
      )

      expect(screen.getByText('Simple Text Link')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      getPathFromDocType.mockReturnValue('/test')

      render(
        <CustomLink docType="test" slug="test">
          <span>Part 1</span>
          <span>Part 2</span>
        </CustomLink>,
      )

      expect(screen.getByText('Part 1')).toBeInTheDocument()
      expect(screen.getByText('Part 2')).toBeInTheDocument()
    })
  })

  describe('Different Document Types', () => {
    it('handles nativePlant docType', () => {
      getPathFromDocType.mockReturnValue('/native-plants/wild-bergamot')

      render(
        <CustomLink docType="nativePlant" slug="wild-bergamot">
          Wild Bergamot
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledWith('nativePlant', 'wild-bergamot')
    })

    it('handles season docType', () => {
      getPathFromDocType.mockReturnValue('/season/spring')

      render(
        <CustomLink docType="season" slug="spring">
          Spring
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledWith('season', 'spring')
    })

    it('handles aboutPage docType', () => {
      getPathFromDocType.mockReturnValue('/about')

      render(
        <CustomLink docType="aboutPage" slug="about">
          About
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledWith('aboutPage', 'about')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty slug', () => {
      getPathFromDocType.mockReturnValue('/native-plants/')

      render(
        <CustomLink docType="nativePlant" slug="">
          Plants List
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledWith('nativePlant', '')

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('href', '/native-plants/')
    })

    it('handles special characters in slug', () => {
      getPathFromDocType.mockReturnValue('/native-plants/wild-bergamot-2024')

      render(
        <CustomLink docType="nativePlant" slug="wild-bergamot-2024">
          Wild Bergamot 2024
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledWith('nativePlant', 'wild-bergamot-2024')
    })

    it('handles special characters in id', () => {
      getPathFromDocType.mockReturnValue('/test')

      render(
        <CustomLink docType="test" slug="test" id="section-1-a">
          Test Section
        </CustomLink>,
      )

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('href', '/test#section-1-a')
    })

    it('handles empty id gracefully (no hash added)', () => {
      getPathFromDocType.mockReturnValue('/test')

      render(
        <CustomLink docType="test" slug="test" id="">
          Test Link
        </CustomLink>,
      )

      const link = screen.getByTestId('next-link')
      // Empty string is falsy, so no hash is added
      expect(link).toHaveAttribute('href', '/test')
    })
  })

  describe('Integration with getPathFromDocType', () => {
    it('calls getPathFromDocType with correct parameters', () => {
      getPathFromDocType.mockReturnValue('/expected/path')

      render(
        <CustomLink docType="testType" slug="testSlug">
          Test
        </CustomLink>,
      )

      expect(getPathFromDocType).toHaveBeenCalledTimes(1)
      expect(getPathFromDocType).toHaveBeenCalledWith('testType', 'testSlug')
    })

    it('uses the return value from getPathFromDocType correctly', () => {
      const expectedPath = '/some/complex/path'
      getPathFromDocType.mockReturnValue(expectedPath)

      render(
        <CustomLink docType="test" slug="test">
          Test
        </CustomLink>,
      )

      const link = screen.getByTestId('next-link')
      expect(link).toHaveAttribute('href', expectedPath)
    })
  })
})
