'use client'

import dynamic from 'next/dynamic'
import { metadata, viewport, NextStudio } from 'next-sanity/studio'

import config from './../../../sanity.config.js'

// TODO: Themeing and more studio control...what needs to be done?
// TODO: Should Head be used here?
// const Studio = dynamic(() => import('./studio'), { ssr: false })

export default function StudioPage() {
  // when this component is loaded, the navigation should be hidden

  return <NextStudio config={config} />
}
