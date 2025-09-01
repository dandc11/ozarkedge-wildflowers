import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from './sanity.api.js'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  // Disable stega globally; enable per-request with sanityFetch when Draft Mode is enabled
  stega: { enabled: false, studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL },
})
