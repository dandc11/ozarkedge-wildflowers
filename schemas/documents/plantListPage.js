import { GiFlowers } from 'react-icons/gi'
import {
  defineArrayMember,
  defineType,
  defineField,
  defineConfig,
} from 'sanity'

import { TextInputWithCharCount } from '../components/TextInputWithCharCount'

export default defineConfig({
  name: 'plantListPage',
  title: 'Native Wildflowers List Page',
  icon: GiFlowers,
  type: 'document',
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Plant List Page main header',
      description: 'Add the main header for this page.',
      validation: (Rule) => Rule.required(),
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
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
    }),
    defineField({
      name: 'mainImage',
      title: 'Header Image',
      type: 'mainImage',
      description: 'Add an image appear in the header for this page.',
      validation: (Rule) => Rule.required(),
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
      name: 'mobileImage',
      title: 'Mobile Image',
      description:
        'Optional - Provide an image cropped for mobile viewports. If blank, the main image will be used.',
      type: 'mainImage',
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
      description:
        'Choose light when using a dark image and dark when using a light image.',
      type: 'string',
      options: {
        list: ['light', 'dark'],
      },
    }),
    defineField({
      name: 'plantListInformation',
      title: 'Plant List Introduction Text',
      description: 'Add the body text for the plant list page here.',
      type: 'pageBodyPortableText',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      description:
        'The URL slug for this page (read-only since changing will break links under this path).',
      readOnly: true,
    }),
  ],
})
