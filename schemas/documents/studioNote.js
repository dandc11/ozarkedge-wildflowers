import { GiNotebook } from 'react-icons/gi'
import { defineField, defineType } from 'sanity'

/**
 * A place for content editors to record their own learnings while working in the
 * Studio — the counterpart to the read-only `studioGuide` pages.
 *
 * Studio-only, like `studioGuide`, and never queried by the site. Unlike
 * `studioGuide` this type is fully editable: editors create, edit, publish and
 * delete their own notes.
 */
export const STUDIO_NOTE_CATEGORIES = [
  { title: 'Publishing & Drafts', value: 'publishing' },
  { title: 'Tags & Media', value: 'tags' },
  { title: 'Editing Content', value: 'editing' },
  { title: 'Finding Things', value: 'navigation' },
  { title: 'Something Went Wrong', value: 'troubleshooting' },
  { title: 'Idea or Request', value: 'idea' },
  { title: 'Other', value: 'other' },
]

export default defineType({
  name: 'studioNote',
  title: 'Learnings & Notes',
  icon: GiNotebook,
  type: 'document',
  preview: {
    select: { title: 'title', category: 'category' },
    prepare({ title, category }) {
      const label = STUDIO_NOTE_CATEGORIES.find((option) => option.value === category)?.title
      return { title, subtitle: label ?? 'Uncategorised' }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A short summary of what you learned — enough to recognise it later.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'What this note is about, so related notes group together.',
      options: {
        list: STUDIO_NOTE_CATEGORIES,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Note',
      type: 'textOnlyPortText',
      description: 'The note itself. Anything worth remembering or worth asking about later.',
    }),
  ],
})
