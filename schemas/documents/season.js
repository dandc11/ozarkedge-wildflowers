import { GiSunCloud } from 'react-icons/gi'
import { defineField, defineArrayMember, defineType } from 'sanity'

import { TextInputWithCharCount } from '../components/TextInputWithCharCount'

export default defineType({
  name: 'season',
  title: 'Seasons',
  icon: GiSunCloud,
  type: 'document',
  groups: [
    {
      name: 'metadata',
      title: 'Season Metadata',
      despcription: 'Select the season, metadescription, tags and a slug.',
    },
    {
      name: 'images',
      title: 'Season Main Images',
      despcription: 'Add the main images this season.',
    },
    {
      name: 'text',
      title: 'Season Text',
      despcription: 'Add text for the seaons description and teaser content.',
    },
    {
      name: 'feature',
      title: 'Feature Section',
      despcription:
        'Add a section featuring related content on another part of the site (optional).',
    },
  ],
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
      group: 'metadata',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        "How this page's name will appear in the url. Keep it short and avoid spaces.",
      type: 'slug',
      validation: (Rule) => Rule.required(),
      group: 'metadata',
      readOnly: true,
      options: {
        source: 'seasonName',
        validation: (Rule) => [Rule.unique()],
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta-description',
      components: {
        input: TextInputWithCharCount,
      },
      validation: [
        (Rule) => Rule.required(),
        (Rule) => Rule.max(200),
        (Rule) => Rule.min(40),
      ],
      group: 'metadata',
      description:
        'Add very brief description (one or two sentences) for search engines and teaser sections on the site. Should be between 40 and 200 characters.',
      type: 'text',
    }),
    defineField({
      name: 'menuButtonColor',
      title: 'Menu Button Color',
      description:
        'Choose light when using a dark image and dark when using a light image.',
      type: 'string',
      group: 'images',
      options: {
        list: ['light', 'dark'],
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      description:
        'Add an image for the page banner that will display on screen sizes 900px and above.',
      type: 'mainImage',
      options: {
        validation: (Rule) => [Rule.required()],
        hotspot: true,
      },
      group: 'images',
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      description:
        'Optional - Provide an cropped for mobile and tablet devices which will display on screen sizes below 900px. If not provided, the main image will be used.',
      type: 'mainImage',
      group: 'images',
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
      // Hidden field to store the months of the season as numbers - set to read-only to prevent accidental changes
      name: 'monthNumbers',
      title: 'Season Months',
      description:
        "These are the months used for this season. Plants' flowering months will be matched to these to determine the season the plant corresponds to. This field is read-only to prevent accidental changes.",
      hidden: true,
      readOnly: true,
      group: 'metadata',
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
      group: 'text',
      type: 'pageBodyPortableText',
    }),
    defineField({
      name: 'feature',
      title: 'Feature Section',
      description:
        'Add a section featuring related content on another part of the site (optional).',
      type: 'feature',
      group: 'feature',
    }),
  ],
})
