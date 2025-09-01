/**
 * Custom testing utilities for ozarkedge-wildflowers project
 *
 * This file provides enhanced render functions and utilities that wrap
 * React Testing Library with project-specific context providers and setup.
 */

import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { LightboxContext } from '../../contexts/LightboxContext'

/**
 * Default context values that match the actual context structure
 */
const defaultContextValues = {
  lightbox: {
    lightboxOpenImgKey: null,
    setLightBoxOpenImgKey: jest.fn(),
    lightboxIdentifier: null,
    setLightboxIdentifier: jest.fn(),
  },
}

/**
 * Customizable render function that allows selecting which providers to include
 *
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @param {Object} options.contextValues - Context values to override defaults
 * @param {Array<string>} options.contexts - Which contexts to include (default: all)
 * @param {Object} options.renderOptions - Additional options passed to RTL render
 * @returns {Object} RTL render result with additional utilities
 */
export function renderWithContext(ui, options = {}) {
  const { contextValues = {}, contexts = ['lightbox'], ...renderOptions } = options

  // Merge provided context values with defaults
  const mergedContextValues = {
    lightbox: {
      ...defaultContextValues.lightbox,
      ...(contextValues.lightbox || {}),
    },
  }

  // Create wrapper that conditionally includes requested contexts
  function CustomProviders({ children }) {
    let wrappedChildren = children

    // Conditionally wrap with LightboxContext if requested
    if (contexts.includes('lightbox')) {
      wrappedChildren = (
        <LightboxContext.Provider value={mergedContextValues.lightbox}>
          {wrappedChildren}
        </LightboxContext.Provider>
      )
    }

    return wrappedChildren
  }

  return rtlRender(ui, { wrapper: CustomProviders, ...renderOptions })
}

/**
 * Render with all context providers (backward compatible API)
 */
export function render(ui, options = {}) {
  const { lightboxContextValue, ...renderOptions } = options

  return renderWithContext(ui, {
    contexts: ['lightbox'],
    contextValues: lightboxContextValue ? { lightbox: lightboxContextValue } : {},
    ...renderOptions,
  })
}

/**
 * Render without any context providers
 */
export function renderWithoutProviders(ui, options = {}) {
  return renderWithContext(ui, { contexts: [], ...options })
}

/**
 * Create user event instance with sensible defaults
 */
export const createUser = (options) => userEvent.setup(options)

/**
 * Create mock Sanity query response structure
 *
 * @param {any} data - The data to include in the response
 * @param {Object} options - Additional response options
 * @returns {Object} Mock query response
 */
export function createMockSanityResponse(data, options = {}) {
  return {
    data,
    loading: false,
    error: null,
    ...options,
  }
}

/**
 * Common wait options for async operations
 */
export const waitForOptions = {
  timeout: 5000,
  interval: 100,
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { userEvent }
