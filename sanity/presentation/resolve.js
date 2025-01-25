import { defineLocations, defineDocuments } from 'sanity/presentation'

export const mainDocuments = defineDocuments([
  {
    route: '/native-plants/:slug',
    filter: `_type == "nativePlant" && slug.current == $slug`,
  },
  {
    route: '/seasons/:slug',
    filter: `_type == "season" && slug.current == $slug`,
  },
])

export const locations = {
  settings: defineLocations({
    message: 'This document is used on all pages',
    tone: 'caution',
  }),
  landingPage: defineLocations({
    message: 'This document is used to render the Home page',
    tone: 'positive',
    locations: [{ title: 'Home', href: '/' }],
  }),
  aboutPage: defineLocations({
    message: 'This document is used to render the About Ozarkedge page',
    tone: 'positive',
    locations: [
      {
        title: 'About',
        href: '/about',
      },
    ],
  }),
  plantListPage: defineLocations({
    select: { title: 'Plant List Page', slug: 'slug.current' },
    message: 'This document is used to render the Plant List page',
    tone: 'positive',
    locations: [
      {
        title: 'Plant List Page',
        href: '/native-plants',
      },
    ],
  }),
}
