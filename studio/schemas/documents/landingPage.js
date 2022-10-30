import { GiHouse } from 'react-icons/gi';

export default {
    name: 'landingPage',
    title: 'Landing Page',
    icon: GiHouse,
    type: 'document',
    liveEdit: false,
    // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
    __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],
    fields: [
        {
            name: 'titleText',
            title: 'Title Text',
            description: 'This is the text for landing page banner.',
            type: 'string',
        },
        {
            name: 'subtitleText',
            title: 'Subtitle Text',
            description:
                "This is the text for the subtitle beneath the banner. Leave it empty if you don't want any to appear.",
            type: 'text',
        },
        {
            name: 'mainImage',
            title: 'Main Image',
            description: 'Select the banner image for the landing page.',
            type: 'mainImage',
        },
        {
            name: 'mobileImage',
            title: 'Mobile Image',
            description:
                'If a different image should appear at mobile screen sizes, or a different crop of the main image, provide that here. If blank, the main image will be used at all screen sizes.',
            type: 'image',
            options: {
                hotspot: true,
                metadata: [
                    'blurhash', // Default: included
                    'lqip', // Default: included
                    'palette', // Default: included
                ],
            },
        },
        {
            name: 'buttonOne',
            title: 'Button One',
            description:
                'The button will only appear if you provide a value for the text and the link field.',
            type: 'button',
        },
        {
            name: 'buttonTwo',
            title: 'Button Two',
            description:
                'The button will only appear if you provide a value for the text and the link field.',
            type: 'button',
        },
    ],
};
