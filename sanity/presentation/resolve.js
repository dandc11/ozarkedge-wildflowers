import { defineLocations, defineDocuments } from 'sanity/presentation'

export const mainDocuments = defineDocuments([
  {
    route: '/native-plants/:slug',
    filter: `_type == "nativePlant" && slug.current == $slug`,
  },
  {
    route: '/native-plants',
    filter: `_type == "plantListPage" && slug.current == $slug`,
  },
  {
    route: 'seasons/:slug',
    filter: `_type == "page" && slug.current == $slug`,
  },
])

export const resolve = {
  locations: {
    landingPage: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Landing Page',
            href: '/',
          },
        ],
      }),
    }),
    aboutPage: defineLocations([
      {
        title: 'title',
        href: '/about',
      },
    ]),
    // Add more document types as needed
  },
}
