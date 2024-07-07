import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'thumbnailImage',
  title: 'Thumbnail Image',
  type: 'image',
  options: {
    hotspot: true,
    metadata: [
      'blurhash', // Default: included
      'lqip', // Default: included
      'palette', // Default: included
    ],
  },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      hidden: ({ parent }) => !parent?.asset,
      validation: (Rule) =>
        Rule.error('Alternative text is required.').required(),
      description:
        'A very brief description of the image that will appear only in the html - important for SEO and accessiblity.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      hidden: ({ parent }) => !parent?.asset || !parent?.showCaption,
      description:
        'Optional caption text for this image. If you add text here, a caption will display with this image. Leave this field blank if a caption is not desired.',
      group: 'caption',
    }),
    defineField({
      name: 'showCaption',
      title: 'Show Caption',
      type: 'boolean',
      description: 'Whether to show a caption with this image.',
      group: 'caption',
    }),
  ],
})
