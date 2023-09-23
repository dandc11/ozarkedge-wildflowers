import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
    metadata: [
      'blurhash', // Default: included
      'lqip', // Default: included
      'palette', // Default: included
    ],
  },
  fieldsets: [
    {
      name: 'presentation',
      title: 'Image Presensation Options (within text blocks)',
      options: { collapsible: true, collapsed: true },
    },
  ],
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
      hidden: ({ parent }) => !parent?.asset,
      description:
        'Optional caption text for this image. If you add text here, a caption will display with this image. Leave this field blank if a caption is not desired.',
    }),
    defineField({
      name: 'captionPosition',
      title: 'Caption position',
      type: 'string',
      hidden: ({ parent }) => !parent?.asset,
      description:
        'Position the image caption, if there is one.',
      options: {
        list: [
          { title: 'Below Image (Default)', value: 'below' },
          { title: 'Inset Left', value: 'insetLeft' },
          { title: 'Inset Right left', value: 'insetRight' },
        ],
        layout: 'radio', // <-- defaults to 'dropdown'
      },
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      description:
        'Center is the default. Floating the image left or right will allow paragraph text to wrap around the image. NOTE: This setting will have no effect outside of text blocks. Images will be centered on mobile.',
      options: {
        list: [
          { title: 'Center (Default)', value: 'center' },
          { title: 'Float left', value: 'left' },
          { title: 'Float right', value: 'right' },
        ],
        layout: 'radio', // <-- defaults to 'dropdown'
      },
      fieldset: 'presentation',
    }),
    defineField({
      name: 'imageWidth',
      title: 'Image Width',
      type: 'string',
      description:
        'Set the width of the image as a percentage of the text block\'s width.  NOTE: This setting will have no effect outside of text blocks. Images will fall back to full width on mobile.',
      options: {
        list: [
          { title: '20%', value: '20%' },
          { title: '25%', value: '25%' },
          { title: '33%', value: '33%' },
          { title: '50% (Default)', value: '50%' },
          { title: '66%', value: '66%' },
          { title: '75%', value: '75%' },
          { title: '100%', value: '100%' },
        ],
        layout: 'radio', // <-- defaults to 'dropdown'
      },
      fieldset: 'presentation',
    }),
  ],
  preview: {
    select: {
      imageUrl: 'asset.url',
      title: 'caption',
    },
  },
})
