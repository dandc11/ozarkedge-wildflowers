import { GiSpellBook } from 'react-icons/gi'
import { defineField, defineType } from 'sanity'

/**
 * Internal help documentation shown inside the Studio under "📘 Help & Guides".
 *
 * Studio-only: no GROQ query in `sanity/lib/queries.js` may reference this type
 * and it is never rendered on the Next.js site — `sanity/lib/queries.test.js`
 * enforces that.
 *
 * `readOnly` makes the form view-only for editors. It constrains the Studio UI
 * only, so guide content is still authored through the seed script
 * (`scripts/seed-studio-guides.mjs`) or the Sanity MCP tools — which is the point:
 * editors read these, they don't maintain them. `sanity.config.js` additionally
 * strips every publish/delete/duplicate path from this type's document actions.
 */
export default defineType({
  name: 'studioGuide',
  title: 'Help & Guides',
  icon: GiSpellBook,
  type: 'document',
  readOnly: true,
  preview: {
    select: { title: 'title', order: 'order' },
    prepare({ title, order }) {
      return {
        title,
        subtitle: typeof order === 'number' ? `#${order}` : 'Unordered',
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown as the guide heading and in the Help & Guides list.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Sort position in the Help & Guides list, ascending. Seeded in steps of ten so a ' +
        'new guide can be slotted between two existing ones without renumbering.',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'studioGuideBody',
    }),
  ],
})
