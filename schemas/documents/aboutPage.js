import { GiOakLeaf } from 'react-icons/gi'
import {defineField, defineType} from 'sanity'
import { defineUrlResolver } from 'sanity-plugin-iframe-pane'

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
      description: 'Provide an image for the background of the landing page.',
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
      name: 'body',
      title: 'Page Body Text',
      description: 'This is the text for the body of the page.',
      type: 'pageBodyPortableText',
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
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
  ],
})
