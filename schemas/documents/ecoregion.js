import { GiHills } from 'react-icons/gi'
import { defineField, defineType } from 'sanity'

import { TextInputWithCharCount } from '../components/TextInputWithCharCount'

/**
 * Lightweight ecoregion document — the honest spatial unit for regional work
 * (ecoregions, not counties, match the resolution of the projections we cite).
 *
 * Polygon geometry does NOT live here; boundaries are served as a static GeoJSON
 * asset (see public/data/). This document holds the name, EPA code and a short
 * description so field notes can reference it and future ecoregion pages can be built.
 */
export default defineType({
  name: 'ecoregion',
  title: 'Ecoregions',
  icon: GiHills,
  type: 'document',
  preview: {
    select: {
      title: 'name',
      subtitle: 'epaCode',
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Ecoregion Name',
      description: 'e.g. Ozark Highlands, Boston Mountains, Arkansas Valley.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'epaCode',
      title: 'EPA Level III/IV Code',
      description: 'The Omernik / EPA ecoregion code (e.g. "39" for Ozark Highlands).',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "How this ecoregion's name appears in the url. Keep it short and avoid spaces.",
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      components: {
        input: TextInputWithCharCount,
      },
      validation: [
        (Rule) =>
          Rule.max(280).warning('Keep the ecoregion summary short — aim for a sentence or two.'),
      ],
      description: 'A brief, plain-language description of this ecoregion.',
      type: 'text',
      rows: 3,
    }),
  ],
})
