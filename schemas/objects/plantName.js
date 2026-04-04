import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'plantName',
  title: 'Plant Name',
  type: 'object',
  fields: [
    defineField({
      name: 'botanicalName',
      title: 'Botanical Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'commonName',
      title: 'Common Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameInformation',
      title: 'Plant Name Information',
      description: "Add any additional information about the plant's names here.",
      type: 'pageBodyPortableText',
    }),
  ],
})
