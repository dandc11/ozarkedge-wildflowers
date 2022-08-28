import { GiOakLeaf } from 'react-icons/gi';

export default {
    name: 'aboutPage',
    title: 'About Page',
    type: 'document',
    icon: GiOakLeaf,
    liveEdit: false,
    // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
    __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],
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
            name: 'slug',
            title: 'Slug',
            description:
                "How this page's name will appear in the url. Keep it short and avoid spaces.",
            type: 'slug',
            validation: (Rule) => Rule.required(),
            options: {
                source: 'title',
                validation: (Rule) => [Rule.unique()],
                slugify: (input) =>
                    input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
            },
        },
    ],
};
