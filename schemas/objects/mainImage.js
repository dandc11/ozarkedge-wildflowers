import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'mainImage',
  type: 'image',
  title: 'Image',
  options: {
    hotspot: true,
    metadata: [
      'blurhash', // Default: included
      'lqip', // Default: included
      'palette', // Default: included
    ],
  },
  fields: [
    defineType({
      name: 'caption',
      type: 'string',
      title: 'Caption',
    }),
    defineType({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description:
        'A very brief description of the image. Important for SEO and accessiblity.',
      validation: (Rule) =>
        Rule.error('You have to fill out the alternative text.').required(),
    }),
  ],
  preview: {
    select: {
      imageUrl: 'asset.url',
      title: 'caption',
    },
  },
})
