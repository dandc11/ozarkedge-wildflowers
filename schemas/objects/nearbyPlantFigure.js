import { defineField, defineType } from 'sanity'

/**
 * nearbyPlantFigure - A specialized object type for plants growing nearby
 *
 * This extends the standard figure (image) type with a plantBotanicalName field
 * that serves as a natural key for linking to nativePlant documents. The botanical
 * name enables auto-linking in GROQ queries and supports future features like:
 * - Bidirectional plant relationship queries
 * - Network analysis of plant co-occurrence
 * - Habitat compatibility analysis
 * - Interactive plant selector interfaces
 *
 * Auto-linking pattern in GROQ:
 * growingNearbyPlantList[]{
 *   ...,
 *   "linkedPlant": *[_type == "nativePlant" &&
 *     lower(plantName.botanicalName) == lower(^.plantBotanicalName)][0]{
 *     _id, slug, plantName, previewImage
 *   }
 * }
 */
export default defineType({
  name: 'nearbyPlantFigure',
  title: 'Nearby Plant (with Auto-Linking)',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Plant Image',
      description: 'Upload or select an image of the plant growing nearby.',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.error('Alternative text is required.').required(),
          description:
            'A very brief description of the image that will appear only in the html - important for SEO and accessibility.',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption text for this image.',
        }),
        defineField({
          name: 'showCaption',
          title: 'Show Caption',
          type: 'boolean',
          description: 'Whether to show a caption with this image.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'plantBotanicalName',
      type: 'string',
      title: 'Botanical Name',
      description:
        'Enter the botanical name (e.g., "Echinacea pallida"). This will automatically link to the plant\'s page once it exists. Use the exact botanical name from the plant\'s page for auto-linking to work.',
      placeholder: 'e.g., Echinacea pallida',
      validation: (Rule) => [
        Rule.required().error('Botanical name is required for plant identification'),
        Rule.custom((value) => {
          if (!value) return true
          // Check for common formatting issues
          if (value !== value.trim()) {
            return 'Botanical name should not have leading or trailing spaces'
          }
          // Check if it looks like a botanical name (at least two words)
          const words = value.trim().split(/\s+/)
          if (words.length < 2) {
            return 'Botanical names typically have at least two parts (genus and species)'
          }
          return true
        }),
      ],
    }),
    defineField({
      name: 'commonName',
      type: 'string',
      title: 'Common Name (optional)',
      description: 'Optional common name for editor reference. Not displayed on the site.',
      placeholder: 'e.g., Pale Purple Coneflower',
    }),
  ],
  preview: {
    select: {
      title: 'plantBotanicalName',
      subtitle: 'commonName',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Unnamed plant',
        subtitle: subtitle || 'No common name provided',
        media: media,
      }
    },
  },
})
