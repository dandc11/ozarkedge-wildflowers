import { GiHouse } from 'react-icons/gi'
import { defineArrayMember, defineType, defineField } from 'sanity'

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
    defineField({
      name: 'locationTitle',
      title: 'Location Section Title',
      description: 'The heading text for the location section, e.g. "Where is Ozarkedge?"',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location Section',
      description:
        'Add information here to situate visitors regarding the location and subject matter of what we call Ozarkedge. The location section will only appear if content is added here.',
      type: 'pageBodyPortableText',
    }),
  ],
})
