import { defineField, defineType } from 'sanity'

import { TeaserSectionPreview } from '../components/TeaserSectionPreview'
import { DOCUMENT_TYPES } from '../constants/constants'

export default defineType({
  name: 'feature',
  title: 'Feature Section',
  description:
    '(Optional) Feature sections are a great way to highlight related content in another part of the site. Depending on what kind of device the user is visiting from, they may appear as a colorful banner or a section in a sidebar.',
  type: 'object',
  validation: (rule) =>
    rule.custom((fields) => {
      if ((fields.pullTextFromLink || fields.pullImageFromLink) && !fields.link)
        return `A feature section is trying to pull resources from a link, but no link has been added. You must either add a link to pull resources from, or add body text and images yourself.`
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
      title: 'Feature Title',
      description: 'A headline title for this feature section.',
      type: 'string',
      group: 'text',
    }),
    defineField({
      name: 'featureTheme',
      description: 'Sets the color theme for this feature section.',
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
      title: 'Link',
      description:
        'Select the page that this feature section should direct the visitor toward.',
      type: 'reference',
      to: DOCUMENT_TYPES,
      group: 'text',
    }),
    defineField({
      name: 'pullTextFromLink',
      title: 'Get the body text from the link.',
      description:
        'When selected, the feature section will use the exisitng metadescription text from the linked document (page).',
      type: 'boolean',
      group: 'text',
    }),
    defineField({
      name: 'bodyText',
      description: 'The body text for this feature section.',
      type: 'textOnlyPortText',
      readOnly: ({ parent }) => parent?.pullTextFromLink,
      hidden: ({ parent }) => parent?.pullTextFromLink,
      group: 'text',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      description:
        'Text to appear in the button (which is a link to the page selected in the link field). No more than 25 characters. If left blank, the default value is "See more".',
      validation: (Rule) => Rule.max(25),
      type: 'string',
      group: 'text',
    }),
    defineField({
      name: 'pullImageFromLink',
      title: 'Get the featured image from the link.',
      description:
        'When selected, the feature section will pull the main image from the linked page for use as the feature image.',
      type: 'boolean',
      group: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      readOnly: ({ parent }) => parent?.pullImageFromLink,
      hidden: ({ parent }) => parent?.pullImageFromLink,
      type: 'image',
      group: 'image',
    }),
  ],
  components: { preview: TeaserSectionPreview },
  preview: {
    select: {
      title: 'titleText',
      image: 'image',
      bodyText: 'bodyText',
      pullImageFromLink: 'pullImageFromLink',
      linkId: 'link._ref',
    },
    prepare(selection) {
      return {
        ...selection,
      }
    },
  },
})
