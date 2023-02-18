import React from 'react'
import {DOCUMENT_TYPES} from '../constants/constants';

const InternaLinkRender = ({children}) => <span>{children}</span>;
const ExternaLinkRender = ({children}) => <span>{children}</span>;

export default {
  name: "pageBodyPortableText",
  type: "array",
  title: "Post body",
  of: [
    {
      type: "block",
      title: "Block",
      // Styles let you set what your user can mark up blocks with. These
      // corrensponds with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        // TODO: Need to handle internal vs. external links
        annotations: [
        //   {
        //     name: 'link',
        //     type: 'link',
        //     title: 'Link',
        // }
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
              }
            ],
            blockEditor: {
              icon: () => '🔗 ',
              render: InternaLinkRender,
            },
          },
          {
            name: 'externalLink',
            type: 'object',
            title: 'External link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL'
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                description: 'Link to another site.',
                type: 'boolean'
              }
            ],
            blockEditor: {
              icon: () => '🌐 ',
              render: ExternaLinkRender,
            },
          },
        ],
      },
    },
    {
      type: 'text',
      title: "Text"
    },
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    {
      type: "figure",
      options: { hotspot: true },
    },
  ],
};
