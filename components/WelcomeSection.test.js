/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen } from '../tests/utils/test-utils'

import WelcomeSection from './WelcomeSection'

jest.mock('./ResponsiveImage', () => {
  return function MockResponsiveImage() {
    return <div data-testid="welcome-image" />
  }
})

const block = (text) => ({
  _type: 'block',
  _key: text,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${text}-span`, text, marks: [] }],
})

describe('WelcomeSection', () => {
  const props = {
    introBody: [block('Intro copy')],
    locationBody: [block('Location copy')],
    documentId: 'welcome',
    documentType: 'welcomeSection',
  }

  it('shows the eyebrows by default', () => {
    render(<WelcomeSection {...props} eyebrowText="About Ozarkedge" />)
    expect(screen.getByText('About Ozarkedge')).toBeInTheDocument()
    expect(screen.getByText('Where we are')).toBeInTheDocument()
  })

  it('hides both eyebrows when showEyebrow is false', () => {
    render(<WelcomeSection {...props} showEyebrow={false} />)
    expect(screen.queryByText('Welcome')).not.toBeInTheDocument()
    expect(screen.queryByText('Where we are')).not.toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
  })

  it('renders the CTAs as text links', () => {
    render(<WelcomeSection {...props} />)
    expect(screen.getByRole('link', { name: /Our native plant index/ })).toHaveClass('link-cta')
    expect(screen.getByRole('link', { name: /Read our story/ })).toHaveClass('link-cta')
  })

  it('omits the CTAs when showButtons is false', () => {
    render(<WelcomeSection {...props} showButtons={false} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
