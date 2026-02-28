import { sanityFetch } from '../sanity/lib/sanity.live'
import {
  GET_ALL_PLANTS_SITEMAP_DATA_QUERY,
  GET_ALL_SEASONS_SITEMAP_DATA_QUERY,
} from '../sanity/lib/queries'

const BASE_URL = 'https://ozarkedgewildflowers.com'

/**
 * Generates a dynamic sitemap for the site, including all plant and season pages
 * plus static routes (home, about, native plants list).
 * Plant entries include image URLs for image search indexing.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  // Fetch plant and season data in parallel
  const [plantsResponse, seasonsResponse] = await Promise.all([
    sanityFetch({
      query: GET_ALL_PLANTS_SITEMAP_DATA_QUERY,
      stega: false,
    }),
    sanityFetch({
      query: GET_ALL_SEASONS_SITEMAP_DATA_QUERY,
      stega: false,
    }),
  ])

  const plants = plantsResponse?.data ?? []
  const seasons = seasonsResponse?.data ?? []

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/native-plants`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Plant pages with image sitemaps
  const plantPages = plants
    .filter((plant) => plant?.slug)
    .map((plant) => ({
      url: `${BASE_URL}/native-plants/${plant.slug}`,
      lastModified: plant.updatedAt ? new Date(plant.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.8,
      ...(plant.image && {
        images: [plant.image],
      }),
    }))

  // Season pages
  const seasonPages = seasons
    .filter((season) => season?.slug)
    .map((season) => ({
      url: `${BASE_URL}/season/${season.slug}`,
      lastModified: season.updatedAt ? new Date(season.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

  return [...staticPages, ...plantPages, ...seasonPages]
}
