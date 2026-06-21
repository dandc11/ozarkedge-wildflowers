import { GiCompass } from 'react-icons/gi'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'welcomeSection',
  title: 'Welcome Section',
  type: 'document',
  icon: GiCompass,
  liveEdit: false,
  preview: {
    prepare() {
      return {
        title: 'Welcome Section',
        subtitle: 'Used on the Landing Page and About Page',
      }
    },
  },
  fields: [
    defineField({
      name: 'introHeading',
      title: 'Intro Heading',
      description:
        'Suggested: "A field guide to our corner of the Ozarks". This is the heading for the "Welcome" split.',
      type: 'string',
    }),
    defineField({
      name: 'introImage',
      title: 'Intro Image',
      description:
        'Suggested: A wide landscape or meadow photo. This will be paired with the Intro Body Text in the "Welcome" split. See the above for the locations where this document is used.',
      type: 'simpleImage',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro Body Text',
      description:
        'Body text for the "Welcome" split (what Ozarkedge is and what the plant index covers). Keep to 1-2 short paragraphs to maintain the visual effect — this is introductory copy paired with a side image.',
      type: 'textOnlyPortText',
    }),
    defineField({
      name: 'locationHeading',
      title: 'Location Heading',
      description:
        'Suggested: "Rooted in the Ozark Highlands". This is the heading for the "Where we are" split.',
      type: 'string',
    }),
    defineField({
      name: 'locationImage',
      title: 'Location Image',
      description:
        'Suggested: The Ozark Plateaus elevation/eco-region map or general area map. This will be paired with the Location Body Text in the "Where we are" split.',
      type: 'simpleImage',
    }),
    defineField({
      name: 'locationBody',
      title: 'Location Body Text',
      description:
        'Body text for the "Where we are" split (geographic context of the Ozark Plateaus). Keep to 1-2 short paragraphs to maintain the visual effect— this is introductory copy paired with the eco-region map.',
      type: 'textOnlyPortText',
    }),
  ],
})
