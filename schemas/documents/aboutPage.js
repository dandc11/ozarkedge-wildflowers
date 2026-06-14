import { GiOakLeaf } from 'react-icons/gi'
import { defineField, defineType } from 'sanity'

import { TextInputWithCharCount } from '../components/TextInputWithCharCount'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: GiOakLeaf,
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  // __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      description:
        'Provide an image for the background of the landing page. This will display on desktop (wide) screen sizes. Aspect ratio 2:1, is roughly appropriate.',
      type: 'mainImage',
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      description:
        'Optional - Provide an image cropped for mobile viewports. If blank, the main image will be used.',
      type: 'image',
      options: {
        hotspot: true,
        metadata: [
          'blurhash', // Default: included
          'lqip', // Default: included
          'palette', // Default: included
        ],
      },
    }),
    defineField({
      name: 'menuButtonColor',
      title: 'Menu Button Color',
      description: 'Choose light when using a dark image and dark when using a light image.',
      type: 'string',
      options: {
        list: ['light', 'dark'],
      },
    }),
    defineField({
      name: 'introPhoto',
      title: 'Welcome Section — Intro Photo',
      description:
        'A wide landscape or meadow photo used in the "Welcome" split on the landing page and About page.',
      type: 'mainImage',
    }),
    defineField({
      name: 'ecoRegionMap',
      title: 'Welcome Section — Eco-Region Map',
      description:
        'The Ozark Plateaus elevation/eco-region map used in the "Who & where" split. Upload eco-region.jpg from the design assets.',
      type: 'mainImage',
    }),
    defineField({
      name: 'introBody',
      title: 'Welcome Section — Intro Copy',
      description:
        'Body text for the "Welcome" split (what Ozarkedge is and what the plant index covers). Keep to 2–3 short paragraphs — this is introductory copy paired with a side image.',
      type: 'textOnlyPortText',
    }),
    defineField({
      name: 'locationBody',
      title: 'Welcome Section — Location Copy',
      description:
        'Body text for the "Who & where" split (geographic context of the Ozark Plateaus). Keep to 2–3 short paragraphs — this is introductory copy paired with the eco-region map.',
      type: 'textOnlyPortText',
    }),
    defineField({
      name: 'bannerStandfirst',
      title: 'About Banner — Standfirst',
      description:
        'A short tagline displayed beneath the banner heading on the About page (e.g. "A family\'s long acquaintance with one corner of the Arkansas Ozarks…"). Optional.',
      type: 'text',
    }),
    defineField({
      name: 'body',
      title: 'Our Story',
      description:
        'The full about page narrative — displayed under the "Our Story" section heading. Supports rich text, images, and galleries.',
      type: 'pageBodyPortableText',
    }),
    defineField({
      name: 'aboutTeaserText',
      title: 'Meta-description',
      components: {
        input: TextInputWithCharCount,
      },
      validation: [
        (Rule) => Rule.required(),
        (Rule) => Rule.min(40),
        (Rule) =>
          Rule.max(155).warning(
            'Over 155 characters — Google may truncate this in search results.',
          ),
      ],
      description:
        'A brief description (one or two sentences) for search engines and teaser sections. Aim for 40–155 characters.',
      type: 'text',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'This page can be found on the site at this extension.',
      type: 'slug',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      options: {
        validation: (Rule) => [Rule.unique()],
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
  ],
})
