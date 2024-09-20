import React from 'react';
import { defineField, defineType } from 'sanity'

import IconAppender from '../components/IconAppender';
import { DOCUMENT_TYPES } from '../constants/constants';


export default defineType({  
    name: 'link',
    title: 'Link',
    type: 'object',
    fields: [
        defineField({
            name: 'externalLink',
            type: 'url',
            description:
                'When linking to an external web page, add the url here. It must begin with one of the following: http, https, mailto, tel.',
            title: 'External link (URL)',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel']
            }),
            hidden: ({ parent, value }) => !value && parent?.internal,
        }),
        defineField({
            name: 'internalLink',
            type: 'reference',
            title: 'Internal Link',
            description:
                'When linking to an internal page on this site, select the path here.',
            to: DOCUMENT_TYPES,
            hidden: ({ parent, value }) => {
                return !value && parent?.external
            },
        }),
    ],
    blockEditor: {
        icon: () => '🔗 Link',
        render: IconAppender,
    },
});
