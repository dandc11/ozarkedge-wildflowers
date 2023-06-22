export default {
    name: 'figure',
    title: 'Image',
    type: 'image',
    options: {
        hotspot: true,
        metadata: [
            'blurhash', // Default: included
            'lqip', // Default: included
            'palette', // Default: included
        ],
    },
    fields: [
        {
            title: 'Caption',
            name: 'caption',
            type: 'string',
            hidden: ({ parent }) => !parent?.asset,
            description: 'Optional caption text for this image. If you add text here, a caption will display with this image. Leave this field blank if a caption is not desired.',
        },
        {
            name: 'alt',
            type: 'string',
            title: 'Alternative text',
            hidden: ({ parent }) => !parent?.asset,
            validation: (Rule) =>
                Rule.error(
                    'Alternative text is required.'
                ).required(),
            description:
                'A very brief description of the image that will appear only in the html - important for SEO and accessiblity.',
        },
    ],
    preview: {
        select: {
            imageUrl: 'asset.url',
            title: 'caption',
        },
    },
}
