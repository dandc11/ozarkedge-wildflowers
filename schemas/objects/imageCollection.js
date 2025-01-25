import { defineType } from 'sanity'

import { ImageCollectionPreview } from '../components/ImageCollectionPreview'

export default defineType({
  name: 'imageCollection',
  type: 'object',
  title: 'Image Collection',
  fields: [
    {
      name: 'imageCollection',
      description:
        'If you add images here, they will display within the text block together as part of a collection. You can add as many images as you like, and add captions indicating any connections between the images.',
      title: 'Image',
      type: 'array',
      of: [
        {
          type: 'figure',
          title: 'Image',
          description: 'Add an image to the page.',
          options: { hotspot: true },
        },
      ],
    },
  ],
  components: { preview: ImageCollectionPreview },
  preview: {
    select: {
      collection: 'imageCollection',
    },
    prepare(selection) {
      return {
        ...selection,
      }
    },
  },
  icon: () => '🖼️',
})
