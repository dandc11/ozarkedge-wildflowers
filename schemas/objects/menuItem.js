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
      name: 'section',
      title: 'Category',
      description:
        "If this item is a top level page (i.e. Season list page, Native Plants list page, Home), select top-level. If it's a member of a category (i.e. a season page like Fall), select the category.",
      type: 'string',
      options: {
        list: [
          { title: 'Top level pages', value: 'top' },
          { title: 'Season Pages', value: 'seasons' },
        ],
      },
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
      type: 'figure',
      description: 'This image will appear next to this item in the menu.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
