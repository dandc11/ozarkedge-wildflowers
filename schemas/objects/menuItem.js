import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menu item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'This is the text that will appear in the menu.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'This image will appear next to this item in the menu.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
