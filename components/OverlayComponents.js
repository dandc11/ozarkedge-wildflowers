/* eslint-disable react/display-name */
'use client'
import React from 'react'
import { defineOverlayComponents } from '@sanity/visual-editing/unstable_overlay-components'

export const CustomOverlay = ({ children, componentName }) => (
  <div
    style={{
      position: 'relative',
      border: '2px solid blue',
      padding: '5px',
    }}
  >
    {children}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        background: 'rgba(0,0,255,0.7)',
        color: 'white',
        padding: '2px 5px',
        fontSize: '12px',
      }}
    >
      {componentName}
    </div>
  </div>
)

// Component resolver
export const overlayComponents = defineOverlayComponents((context) => {
  const { document, element, field, type } = context
  console.log('context:', context)

  // For ImageCollection
  if (type === 'image' && field?.name === 'imageCollection') {
    return (props) => <CustomOverlay {...props} componentName="Image Collection" />
  }

  // For other custom components
  if (type === 'object' && field?.name === 'customComponent') {
    return (props) => <CustomOverlay {...props} componentName="Custom Component" />
  }

  // You can add more conditions based on document type, element attributes, etc.
  // For example:
  // if (document.name === 'product' && element.dataset.customComponent) {
  //   return props => <DynamicOverlay {...props} componentName={element.dataset.customComponent}
  // Add more conditions for other custom components as needed

  return undefined
})
