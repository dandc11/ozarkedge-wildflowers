import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from './sanity.api.js'

export function getClient(preview) {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    const newClient = client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })

    return newClient
  }
  return client
}
