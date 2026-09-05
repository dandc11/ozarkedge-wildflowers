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
  // Singleton pages. These have exactly one document each (see SINGLETONS in
  // sanity/structure/index.js), so matching on _type alone resolves them.
  {
    route: '/',
    filter: `_type == "landingPage"`,
  },
  {
    route: '/about',
    filter: `_type == "aboutPage"`,
  },
  {
    route: '/native-plants',
    filter: `_type == "plantListPage"`,
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
    // `botanicalName`, not `title`, on purpose. Sanity runs this select map through the
    // same preparation it uses for document previews, which type-checks the reserved keys
    // (title, subtitle, description, imageUrl, date) and accepts only scalars.
    // plantName.botanicalName is an array, and a rejected reserved key discards the whole
    // selection — replacing it with an "Invalid preview config" placeholder that takes
    // `slug` down with it. Selecting under a non-reserved key skips that check, so the
    // array is narrowed below where we control it.
    select: { botanicalName: 'plantName.botanicalName', slug: 'slug.current' },
    message: `This document is used to render a Native Plant page`,
    resolve: (doc) => {
      // Without a slug there is no page to link to, so offer no location rather than
      // a link to /native-plants/undefined. The banner then shows its zero-count
      // label: the `message` above only reaches the UI when the resolved value
      // carries one, and a resolver result does not.
      if (!doc?.slug) return { locations: [] }

      const botanicalName = Array.isArray(doc.botanicalName)
        ? doc.botanicalName[0]
        : doc.botanicalName

      return {
        locations: [
          {
            title: botanicalName || 'Native Plant',
            href: `/native-plants/${doc.slug}`,
          },
        ],
      }
    },
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
