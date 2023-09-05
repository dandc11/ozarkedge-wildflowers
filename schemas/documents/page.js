import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fieldsets: [
    {
      title: 'SEO & metadata',
      name: 'metadata',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Page sections',
      of: [
        defineArrayMember(
          { type: 'nativePlant' },
          { type: 'imageSection' },
          { type: 'textSection' }
        ),
      ],
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'This description populates meta-tags on the webpage',
      fieldset: 'metadata',
    }),
  ],
})
