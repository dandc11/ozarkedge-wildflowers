import { GiFlowers } from 'react-icons/gi'
import {
  defineArrayMember,
  defineType,
  defineField,
  defineConfig,
} from 'sanity'

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
      name: 'headerImage',
      title: 'Header Image',
      description: 'Add an image appear in the header for this page.',
      type: 'image',
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
      name: 'menuButtonColor',
      title: 'Menu Button Color',
      description: 'Choose light when using a dark image and dark when using a light image.',
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
