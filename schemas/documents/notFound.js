import { GiSasquatch } from 'react-icons/gi'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'notFoundPage',
  title: '404 Page (Not Found)',
  description:
    "This is our error or 404 page to display when a page is not found. The heading reads: Sorry, the page you're looking for has not been found. An additional message can be added if desired.",
  type: 'document',
  icon: GiSasquatch,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'This is the document title.',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Page Not Found Message',
      description:
        "A message to appear subsequent to the heading. If left blank, only the heading will appear (Sorry, the page you're looking for has not been found.).",
      type: 'textOnlyPortText',
    }),
    defineField({
      name: 'image',
      type: 'figure',
      title: 'Page Image',
      description:
        'Add an image to be displayed on the page between the heading and the message text.',
    }),
    defineField({
      name: 'menuButtonColor',
      title: 'Menu Button Color',
      description: 'Choose light when using a dark image and dark when using a light image.',
      type: 'string',
      options: {
        list: ['light', 'dark'],
      },
    }),
  ],
})
