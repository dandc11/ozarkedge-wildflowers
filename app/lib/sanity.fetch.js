import 'server-only';

import { draftMode } from 'next/headers';

import { client } from './sanity.client';

export const token = process.env.SANITY_API_READ_TOKEN;

// TODO: implment this to get page and component data where appropriate
export async function sanityFetch({ query, params = {}, tags }) {
  const isDraftMode = draftMode().isEnabled;
  if (isDraftMode && !token) {
    throw new Error('The `SANITY_API_READ_TOKEN` environment variable is required.');
  }

  return client.fetch(query, params, {
    ...(isDraftMode && {
      token: token,
      perspective: 'previewDrafts',
    }),
    // TODO: Convert cache revalidation to use time or tags, not both
    next: {
      revalidate: isDraftMode ? 0 : false,
      tags,
    },
  });
}