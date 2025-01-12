import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from './sanity.api.js'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  // perspective: 'published',
  stega: {
    studioUrl: 'http://localhost:3000/studio',
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }

      return props.filterDefault(props)
    },
  },
})
