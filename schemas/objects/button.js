import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'buttonLabel',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Link',
      description: 'The path to navigate to when the button is pressed.',
      type: 'link',
      validation: (Rule) => Rule.required(),
      // ({ parent, value }) => {
      //     return !value && parent?.external
      //   }
    }),
  ],
})
