import { GiSunCloud } from 'react-icons/gi'
import { defineField, defineArrayMember, defineType } from 'sanity'

export default defineType({
  name: 'season',
  title: 'Seasons',
  icon: GiSunCloud,
  type: 'document',
  preview: {
    select: {
      title: 'seasonName',
      media: 'mainImage', // Use the previewImage field as thumbnail
    },
  },
  fields: [
    defineField({
      name: 'seasonName',
      title: 'Season',
      type: 'string',
      options: {
        list: [
          { title: 'Spring', value: 'spring' },
          { title: 'Summer', value: 'summer' },
          { title: 'Fall', value: 'fall' },
          { title: 'Winter', value: 'winter' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        "How this page's name will appear in the url. Keep it short and avoid spaces.",
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'seasonName',
        validation: (Rule) => [Rule.unique()],
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      // Hidden field to store the months of the season as numbers - set to read-only to prevent accidental changes
      // SPRING: 4, 5, 6 - SUMMER: 7, 8, 9 - FALL: 10, 11, 12 - WINTER: 1, 2, 3
      name: 'monthNumbers',
      title: 'Season Months',
      description:
        "These are the months used for this season. Plants' flowering months will be matched to these to determine the season the plant corresponds to. This field is read-only to prevent accidental changes.",
      hidden: true,
      readOnly: true,
      type: 'array',
      of: [defineArrayMember({ type: 'number' })],
      options: {
        list: [
          { title: 'January', value: 1 },
          { title: 'February', value: 2 },
          { title: 'March', value: 3 },
          { title: 'April', value: 4 },
          { title: 'May', value: 5 },
          { title: 'June', value: 6 },
          { title: 'July', value: 7 },
          { title: 'August', value: 8 },
          { title: 'September', value: 9 },
          { title: 'October', value: 10 },
          { title: 'November', value: 11 },
          { title: 'December', value: 12 },
        ], // <-- predefined values
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Season Description',
      description: 'Add body text content about this season here.',
      type: 'pageBodyPortableText',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      description: 'Add an image to depict this season in the page banner.',
      type: 'figure',
    }),
  ],
})
