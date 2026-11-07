import { GiHamburgerMenu } from 'react-icons/gi'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  icon: GiHamburgerMenu,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'featuredPlant',
      title: 'Featured Plant',
      description:
        'The plant highlighted at the top of the menu on larger screens. Its name and thumbnail image come from the plant page. Leave empty to hide the feature.',
      type: 'reference',
      to: [{ type: 'nativePlant' }],
    }),
    defineField({
      name: 'featuredNote',
      title: 'Featured Plant Note',
      description: 'Optional one-line note shown under the featured plant (80 characters max).',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      hidden: ({ document }) => !document?.featuredPlant,
    }),
  ],
})
