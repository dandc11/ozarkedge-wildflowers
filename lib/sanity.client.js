import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from './sanity.api'

export function getClient(preview) {
  console.log('preview', preview);
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })
  if (preview) {
    console.log('has preview', preview.token);
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    const newClient = client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
    console.log('new client', newClient);

    return newClient
  }
  return client
}
