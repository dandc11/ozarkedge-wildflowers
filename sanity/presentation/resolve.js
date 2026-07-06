import { defineLocations, defineDocuments } from 'sanity/presentation'

export const mainDocuments = defineDocuments([
  {
    route: '/native-plants/:slug',
    filter: `_type == "nativePlant" && slug.current == $slug`,
  },
  {
    route: '/season/:slug',
    filter: `_type == "season" && slug.current == $slug`,
  },
])

export const locations = {
  siteSettings: defineLocations({
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
  nativePlant: defineLocations({
    select: { title: 'plantName.botanicalName', slug: 'slug.current' },
    message: `This document is used to render a Native Plant page`,
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Native Plant',
          href: `/native-plants/${doc?.slug}`,
        },
      ],
    }),
  }),
  season: defineLocations({
    select: { title: 'seasonName', slug: 'slug.current' },
    message: 'This document is used to render a Season page',
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Season',
          href: `/season/${doc?.slug}`,
        },
      ],
    }),
  }),
  welcomeSection: defineLocations({
    message: 'This document renders the Welcome section on the Home and About pages',
    tone: 'positive',
    locations: [
      { title: 'Home', href: '/' },
      { title: 'About', href: '/about' },
    ],
  }),
  menu: defineLocations({
    message: 'This document renders the site navigation menu on all pages',
    tone: 'caution',
  }),
  notFoundPage: defineLocations({
    message: 'This document renders the 404 (Page Not Found) page',
    tone: 'caution',
  }),
}
