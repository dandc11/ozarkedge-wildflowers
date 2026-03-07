import { GiHouse } from 'react-icons/gi'
import { defineArrayMember, defineType, defineField } from 'sanity'

import { TextInputWithCharCount } from '../components/TextInputWithCharCount'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  icon: GiHouse,
  type: 'document',
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],
  fields: [
    defineField({
      name: 'titleText',
      title: 'Title Text',
      description: 'This is the text for landing page banner.',
      type: 'string',
    }),
    defineField({
      name: 'subtitleText',
      title: 'Subtitle Text',
      description:
        "This is the text for the subtitle beneath the banner. Leave it empty if you don't want any to appear.",
      type: 'text',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta-description',
      description:
        'A brief description (one or two sentences) of this page for search engines and social media previews. Aim for 40–155 characters.',
      type: 'text',
      components: {
        input: TextInputWithCharCount,
      },
      validation: [
        (Rule) => Rule.required(),
        (Rule) => Rule.min(40),
        (Rule) =>
          Rule.max(155).warning(
            'Over 155 characters — Google may truncate this in search results.',
          ),
      ],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      description: 'Provide an image for the background of the landing page.',
      type: 'mainImage',
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      description:
        'Optional - Provide an image cropped for mobile viewports. If blank, the main image will be used.',
      type: 'image',
      options: {
        hotspot: true,
        metadata: [
          'blurhash', // Default: included
          'lqip', // Default: included
          'palette', // Default: included
        ],
      },
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
    defineField({
      name: 'buttonOne',
      title: 'Button One',
      description:
        'The button will only appear if you provide a value for the text and the link field.',
      type: 'button',
    }),
    defineField({
      name: 'buttonTwo',
      title: 'Button Two',
      description:
        'The button will only appear if you provide a value for the text and the link field.',
      type: 'button',
    }),
  ],
})
