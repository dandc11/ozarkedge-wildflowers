import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from './sanity.api.js'

// TODO: continue to set perspective and token when getting the client? Or should that be done in the fetch function?
 export  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })