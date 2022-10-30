export default {
    name: 'link',
    title: 'Link',
    type: 'object',
    fields: [
        {
            name: 'external',
            type: 'url',
            description:
                'When linking to an external web page, add the url here.',
            title: 'External link (URL)',
            hidden: ({ parent, value }) => !value && parent?.internal,
        },
        {
            name: 'internal',
            type: 'reference',
            title: 'Internal Link',
            description:
                'When linking to an internal page on this site, select the path here.',
            to: [{ type: 'landingPage' }, { type: 'aboutPage' }],
            hidden: ({ parent, value }) => !value && parent?.external,
        },
    ],
};
