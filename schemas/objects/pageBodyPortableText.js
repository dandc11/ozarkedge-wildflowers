import React from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { DOCUMENT_TYPES } from '../constants/constants'
import IconAppender from '../components/IconAppender'
import { defineArrayMember, defineType } from 'sanity'
import { ImageCollectionPreview } from '../components/ImageCollectionPreview'

export default defineType({
  name: 'pageBodyPortableText',
  type: 'array',
  title: 'Rich Text',
  of: [
    defineArrayMember({
      type: 'block',
      title: 'Block',
      // Styles let you set what your user can mark up blocks with. You can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
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
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: DOCUMENT_TYPES,
              },
            ],
            components: <IconAppender icon={`🔗`} />,
            icon: () => '🔗 ',
          },
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
            icon: () => '🌐 ',
            components: <IconAppender icon={`🌐`} />,
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'figure',
      title: 'Image',
      description: 'Add an image to the page.',
      options: { hotspot: true },
      icon: () => '📸 ',
    }),
    defineArrayMember({
      title: 'Video',
      name: 'portTextVideo',
      type: 'document',
      fields: [
        { title: 'Video Title', name: 'title', type: 'string' },
        {
          title: 'Video file',
          name: 'video',
          type: 'mux.video',
        },
      ],
      icon: () => '🎥 ',
      preview: {
        select: {
          title: 'title',
        },
        prepare: ({ title }) => {
          const hasVideo = [title].filter(Boolean)
          return {
            title: hasVideo ? `Video: ${title}` : 'Video (empty)',
            media: AiOutlineCamera,
          }
        },
      },
    }),
    defineArrayMember({
      name: 'imageCollection',
      type: 'object',
      title: 'Image Collection',
      fields: [
        {
          name: 'imageCollection',
          description:
            'If you add images here, they will display within the text block together as part of a collection. You can add as many images as you like, and add captions indicating any connections between the images.',
          title: 'Image',
          type: 'array',
          of: [
            {
              type: 'figure',
              title: 'Image',
              description: 'Add an image to the page.',
              options: { hotspot: true },
            },
          ],
        },
      ],
      components: {preview: ImageCollectionPreview},
      preview: {
        select: {
          collection: 'imageCollection',
        },
        prepare(selection) {
          return {
            ...selection,
          }
        }
      },
    }),
  ],
})
