import { defineLive } from 'next-sanity/live'

import { client } from './sanity.client'
import { token } from './sanity.token'

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

// Initialize live helpers once and export directly
const live = defineLive({ client, browserToken: token, serverToken: token })

export const SanityLive = live.SanityLive
export const sanityFetch = live.sanityFetch
