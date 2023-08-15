import { GiOakLeaf } from 'react-icons/gi';

export default {
    name: 'aboutPage',
    title: 'About Page',
    type: 'document',
    icon: GiOakLeaf,
    liveEdit: false,
    // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
    // __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'body',
            title: 'Body',
            type: 'pageBodyPortableText',
        },
        {
            name: 'fullPathFromRoot',
            title: 'Full Path From Root',
            description: 'This is the extension from https://ozarkedgewildflowers.com at which this page can be found.',
            type: 'string',    
        },
        {
            name: 'slug',
            title: 'Slug',
            description:
                "This page can be found on the site at this extension.",
            type: 'slug',
            readOnly: true,
            validation: (Rule) => Rule.required(),
            options: {
                validation: (Rule) => [Rule.unique()],
                slugify: (input) =>
                    input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
            },
        },
    ],
};
