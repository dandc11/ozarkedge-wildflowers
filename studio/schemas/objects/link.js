import React from 'react'

const LinkRender = ({children}) => <span>{children} 🌍</span>

export default {
    name: 'link',
    title: 'Link',
    type: 'object',
    fields: [
        {
            name: 'external',
            type: 'url',
            description:
                'When linking to an external web page, add the url here. It must begin with one of the following: http, https, mailto, tel.',
            title: 'External link (URL)',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel']
              }),
            hidden: ({ parent, value }) => !value && parent?.internal,
        },
        {
            name: 'internal',
            type: 'reference',
            title: 'Internal Link',
            description:
                'When linking to an internal page on this site, select the path here.',
            to: [{ type: 'landingPage' }, { type: 'aboutPage' }, {type: 'plantListPage'}, { type: 'nativePlant'}],
            hidden: ({ parent, value }) => {
              return !value && parent?.external
            },
        },
    ],
    blockEditor: {
        icon: () => '🌍',
        render: LinkRender,
      },
};
