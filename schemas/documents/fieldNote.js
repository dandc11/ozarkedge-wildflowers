import { GiNotebook } from 'react-icons/gi'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { TextInputWithCharCount } from '../components/TextInputWithCharCount'

/**
 * Field note — seasonal, plain-language regional writing for the
 * "A Changing Landscape" section. This is where the editorial voice and organic
 * SEO live. Notes present observations and cite others' work; they never make an
 * original scientific claim.
 */
export default defineType({
  name: 'fieldNote',
  title: 'Field Notes',
  icon: GiNotebook,
  type: 'document',
  groups: [
    {
      name: 'metadata',
      title: 'Metadata',
      despcription: 'Title, slug, meta-description and publish date.',
    },
    {
      name: 'images',
      title: 'Images',
      despcription: 'The main image for this field note.',
    },
    {
      name: 'text',
      title: 'Body',
      despcription: 'The body content of the field note.',
    },
    {
      name: 'relationships',
      title: 'Related Content',
      despcription: 'Link this note to a season, ecoregions and species.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      season: 'season.seasonName',
    },
    prepare({ title, media, season }) {
      return {
        title,
        subtitle: season ? `Field note — ${season}` : 'Field note',
        media,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'metadata',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "How this note's title will appear in the url. Keep it short and avoid spaces.",
      type: 'slug',
      group: 'metadata',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        validation: (Rule) => [Rule.unique()],
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta-description',
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
      group: 'metadata',
      description:
        'A brief description (one or two sentences) for search engines and teaser sections. Aim for 40–155 characters.',
      type: 'text',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      description: 'Used to order field notes (newest first).',
      type: 'datetime',
      group: 'metadata',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      description: 'Add a lead image for this field note.',
      type: 'mainImage',
      group: 'images',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'The body content of the field note.',
      type: 'pageBodyPortableText',
      group: 'text',
    }),
    defineField({
      name: 'season',
      title: 'Season',
      description: 'The season this field note relates to (optional).',
      type: 'reference',
      group: 'relationships',
      to: [{ type: 'season' }],
    }),
    defineField({
      name: 'ecoregions',
      title: 'Ecoregions',
      description: 'The ecoregion(s) this note covers.',
      type: 'array',
      group: 'relationships',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'ecoregion' }] })],
    }),
    defineField({
      name: 'species',
      title: 'Species',
      description: 'Native plants referenced in this note.',
      type: 'array',
      group: 'relationships',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'nativePlant' }] })],
    }),
  ],
})
