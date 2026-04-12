import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'plantName',
  title: 'Plant Name',
  type: 'object',
  fields: [
    defineField({
      name: 'botanicalName',
      title: 'Botanical Name',
      description:
        'Primary botanical name first, then alternate names. First name used for slugs and display on cards.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'commonName',
      title: 'Common Name',
      description:
        'Primary common name first, then alternate names. First name used for slugs and display on cards.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'nameInformation',
      title: 'Plant Name Information',
      description: "Add any additional information about the plant's names here.",
      type: 'pageBodyPortableText',
    }),
  ],
})
