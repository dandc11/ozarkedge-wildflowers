import { GiBookshelf } from 'react-icons/gi'
import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Curated "what to read / what to use" shelf item.
 * An authoritative external tool or source with honest one-line notes on what it is
 * good for and what to watch out for. Rendered inline on the "A Changing Landscape"
 * section — it has no page of its own and always links out.
 */
export default defineType({
  name: 'curatedTool',
  title: 'Curated Tools',
  icon: GiBookshelf,
  type: 'document',
  groups: [
    {
      name: 'details',
      title: 'Tool Details',
      despcription: 'The name, link, category and honest notes for this tool.',
    },
    {
      name: 'meta',
      title: 'Sorting & Tags',
      despcription: 'Region tags and shelf ordering.',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Tool / Source Name',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      description: 'The URL this tool or source lives at (opens in a new tab).',
      type: 'url',
      group: 'details',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Map / Occurrences', value: 'map' },
          { title: 'Climate', value: 'climate' },
          { title: 'Birds', value: 'birds' },
          { title: 'Plants', value: 'plants' },
          { title: 'Phenology', value: 'phenology' },
          { title: 'Forests', value: 'forests' },
          { title: 'Reference', value: 'reference' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'goodFor',
      title: 'Good for',
      description: 'One honest line on what this tool does well.',
      type: 'text',
      rows: 2,
      group: 'details',
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: 'watchOut',
      title: 'Watch out',
      description: "One honest line on this tool's limits or caveats (optional).",
      type: 'text',
      rows: 2,
      group: 'details',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'regionTags',
      title: 'Region Tags',
      description: 'Regions this tool is most useful for (e.g. Ozark Highlands, Mid-South).',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Shelf Order',
      description: 'Lower numbers appear first on the shelf.',
      type: 'number',
      group: 'meta',
      initialValue: 100,
    }),
  ],
})
