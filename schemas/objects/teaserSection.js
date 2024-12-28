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
      name: 'image',
      title: 'Image',
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
      description:
        'Text to appear in the button (which is a link to the page selected in the link field). No more than 25 characters. If left blank, the default value is "See more".',
      validation: (Rule) => Rule.max(25),
      type: 'string',
      group: 'text',
    }),
    defineField({
      name: 'bodyText',
      description: 'The body text for this teaser section.',
      type: 'textOnlyPortText',
      readOnly: ({ parent }) => parent?.pullTextFromLink,
      hidden: ({ parent }) => parent?.pullTextFromLink,
      group: 'text',
    }),
    defineField({
      name: 'image',
      description:
        "If you add an image here, it will display within the image slider in this teaser section. You can add as many images as you like, but those displayed won't exceed the max images you set below.",
      title: 'Image',
      readOnly: ({ parent }) => parent?.pullImagesFromLink,
      hidden: ({ parent }) => parent?.pullImagesFromLink,
      type: 'figure',
      group: 'image',
    }),
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
