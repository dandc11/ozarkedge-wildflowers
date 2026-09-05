import { defineArrayMember, defineType } from 'sanity'

/**
 * Rich text for `studioGuide` documents — the editor-facing help pages that live
 * inside the Studio and are never rendered on the public site.
 *
 * Deliberately narrower than `pageBodyPortableText`: text blocks, external links
 * and figures (so a guide can show a screenshot of the Studio UI), and nothing
 * else. There is no `internalLink` annotation, because internal links resolve
 * against `DOCUMENT_TYPES` — the public site's content types — and a reference
 * from Studio documentation into site content would be the one place a
 * Studio-only document could reach into published content.
 */
export default defineType({
  name: 'studioGuideBody',
  type: 'array',
  title: 'Guide Body',
  of: [
    defineArrayMember({
      type: 'block',
      title: 'Block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
      ],
      marks: {
        annotations: [
          {
            name: 'externalLink',
            type: 'object',
            title: 'External link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                description: 'Link to another site.',
                type: 'boolean',
              },
            ],
            icon: () => '🌐',
          },
        ],
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
      },
    }),
    defineArrayMember({ type: 'figure', title: 'Screenshot' }),
  ],
})
