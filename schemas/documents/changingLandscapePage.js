import { GiEarthAmerica } from 'react-icons/gi'
import { defineType, defineField } from 'sanity'

import { TextInputWithCharCount } from '../components/TextInputWithCharCount'

/**
 * "A Changing Landscape" section landing page (single instance).
 * Holds the section's hero, intro, and the standing provenance/attribution note.
 * The observation map, curated shelf, and field-note teasers are assembled on the
 * page from their own documents and the live observations API.
 */
export default defineType({
  name: 'changingLandscapePage',
  title: 'A Changing Landscape Page',
  icon: GiEarthAmerica,
  type: 'document',
  liveEdit: false,
  // Lock to a single, edit-only document (no create/delete from the Studio menus).
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      description: 'The main header for the section.',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      description:
        'A brief description (one or two sentences) for search engines and teaser sections. Aim for 40–155 characters.',
      type: 'text',
    }),
    defineField({
      name: 'mainImage',
      title: 'Header Image',
      type: 'mainImage',
      description: 'Add an image to appear in the header for this page.',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
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
      name: 'intro',
      title: 'Introduction',
      description: 'The introductory body text for the section.',
      type: 'pageBodyPortableText',
    }),
    defineField({
      name: 'sourcesNote',
      title: 'Sources & Attribution Note',
      description:
        'A standing, plain-language statement making clear the observation data comes from others (iNaturalist, GBIF, EPA, OpenStreetMap) — never an original claim.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'shelfHeading',
      title: 'Curated Shelf Heading',
      description: "Heading for the 'what to read / what to use' shelf.",
      type: 'string',
      initialValue: 'What to read, what to use',
    }),
    defineField({
      name: 'fieldNotesHeading',
      title: 'Field Notes Heading',
      description: 'Heading for the field notes list.',
      type: 'string',
      initialValue: 'Field notes',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      description:
        'The URL slug for this page (read-only since changing it will break links under this path).',
      readOnly: true,
    }),
  ],
})
