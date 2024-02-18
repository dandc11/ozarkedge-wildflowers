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
      name: 'menuBackgroundImage',
      type: 'image',
      title: 'Menu Background Image',
      description: 'Add an image for the background of the menu.',
    }),
    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      description: 'Add a title and image for each link in the menu.',
      type: 'array',
      of: [{ type: 'menuItem' }],
    }),
  ],
})
