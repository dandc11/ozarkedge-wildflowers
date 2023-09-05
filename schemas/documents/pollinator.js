import { GiBee } from 'react-icons/gi'
import { defineField, defineArrayMember, defineType } from 'sanity'

export default defineType({
  name: 'pollinator',
  title: 'Pollinators',
  icon: GiBee,
  type: 'document',
  fieldsets: [],
  preview: {
    select: {
      title: 'name',
      media: 'previewImage', // Use the previewImage field as thumbnail
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'figure',
    }),
  ],
})
