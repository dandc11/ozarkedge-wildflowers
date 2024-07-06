import { GiOakLeaf } from 'react-icons/gi'
import {defineField, defineType} from 'sanity'
import { defineUrlResolver } from 'sanity-plugin-iframe-pane'
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
      description: 'Provide an image for the background of the landing page. This will display on desktop (wide) screen sizes. Aspect ratio 2:1, is roughly appropriate.',
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
      name: 'body',
      title: 'Page Body Text',
      description: 'This is the text for the body of the page.',
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
        (Rule) => Rule.max(200),
        (Rule) => Rule.min(40),
      ],
      description:
      'Add very brief description (one or two sentences) for search engines and teaser sections on the site. Should be between 40 and 200 characters.',
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
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
  ],
})
