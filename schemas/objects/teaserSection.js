import { defineField, defineType } from 'sanity'

import {
  TeaserCollectionPreview,
  TeaserSectionPreview,
} from '../components/TeaserSectionPreview'
import { DOCUMENT_TYPES } from '../constants/constants'

export default defineType({
  name: 'teaserSection',
  title: 'Teaser section',
  type: 'object',
  validation: (rule) =>
    rule.custom((fields) => {
      if (
        (fields.pullTextFromLink || fields.pullImagesFromLink) &&
        !fields.link
      )
        return `A teaser section is trying to pull resources from a link, but no link has been added. You must either add a link to pull resources from, or add body text and images yourself.`
      return true
    }),
  groups: [
    {
      name: 'text',
      title: 'Text',
    },
    {
      name: 'images',
      title: 'Images',
    },
  ],
  fields: [
    defineField({
      name: 'titleText',
      description: 'A headline title for this teaser section.',
      type: 'string',
      group: 'text',
    }),
    defineField({
      name: 'teaserTheme',
      description: 'Sets the color theme for this teaser section.',
      type: 'string',
      options: {
        list: [
          { title: 'Spring', value: 'spring' },
          { title: 'Summer', value: 'summer' },
          { title: 'Fall', value: 'fall' },
          { title: 'Winer', value: 'winter' },
        ],
      },
      group: 'text',
    }),
    defineField({
      name: 'link',
      description:
      'Select the page that this teaser section should direct the visitor toward.',
      type: 'reference',
      to: DOCUMENT_TYPES,
      group: 'text',
    }),
    defineField({
      name: 'buttonText',
      description: 'Text to appear in the button (which is a link to the page selected in the link field). No more than 25 characters. If left blank, the default value is "See more".',
      validation: (Rule) => Rule.max(25),
      type: 'string',
      group: 'text',
    }),
    // defineField({
    //   name: 'pullTextFromLink',
    //   title: 'Pull text from another document.',
    //   description:
    //     'Use the exisitng metadescription text from the linked document (page).',
    //   type: 'boolean',
    //   group: 'text',
    // }),
    defineField({
      name: 'bodyText',
      description: 'The body text for this teaser section.',
      type: 'textOnlyPortText',
      readOnly: ({ parent }) => parent?.pullTextFromLink,
      hidden: ({ parent }) => parent?.pullTextFromLink,
      group: 'text',
    }),
    // defineField({
    //   name: 'pullImagesFromLink',
    //   title: 'Pull images from another document.',
    //   description:
    //     'Use the images from the linked document (page). Linked plant pages pull from plant images. Links to the plant list page will pull preview images from plants blooming in the current month. Seasons and About pages will pull the main page image.',
    //   type: 'boolean',
    //   group: 'images',
    // }),
    defineField({
      name: 'images',
      description:
        "If you add images here, they will display within the image slider in this teaser section. You can add as many images as you like, but those displayed won't exceed the max images you set below.",
      title: 'Image',
      readOnly: ({ parent }) => parent?.pullImagesFromLink,
      hidden: ({ parent }) => parent?.pullImagesFromLink,
      type: 'array',
      of: [
        {
          type: 'thumbnailImage',
          title: 'Image',
          description: 'Add an image to this section.',
          options: { hotspot: true },
        },
      ],
      group: 'images',
    }),
    // max number of images to display
    // defineField({
    //   name: 'maxImages',
    //   description:
    //     'Choose up to 8 images to display in the image slider for this teaser section.',
    //   title: 'Max images',
    //   type: 'number',
    //   validation: [(Rule) => Rule.max(8), (Rule) => Rule.min(0)],
    //   group: 'images',
    // }),
  ],
  components: { preview: TeaserSectionPreview },
  preview: {
    select: {
      title: 'titleText',
      images: 'images',
      bodyText: 'bodyText',
      link: 'link',
    },
    prepare(selection) {
      return {
        ...selection,
      }
    },
  },
})
