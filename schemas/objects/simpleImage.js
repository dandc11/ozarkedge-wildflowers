import { defineField, defineType } from 'sanity'

import { AltTextInput } from '../components/AltTextInput'

export default defineType({
  name: 'simpleImage',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
    metadata: ['blurhash', 'lqip', 'palette'],
  },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      hidden: ({ parent }) => !parent?.asset,
      validation: (Rule) => Rule.error('Alternative text is required.').required(),
      description:
        'A brief description of the image for screen readers and SEO. Keep it concise.',
      components: { input: AltTextInput },
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      hidden: ({ parent }) => !parent?.asset,
      description: 'Optional caption displayed beneath the image.',
    }),
  ],
})
