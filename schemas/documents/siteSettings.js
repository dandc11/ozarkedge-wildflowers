import { defineField, defineArrayMember, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  type: 'document',
  title: 'Site Settings',
  //   __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Site Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Describe your site for search engines and social media.',
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      title: 'Keywords',
      description: 'Add keywords that describe this site for SEO purposes.',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
    }),
  ],
})
