import { GiFlowerEmblem } from 'react-icons/gi';
import AssetSource from 'part:sanity-plugin-media-library/asset-source';

export default {
    name: 'nativePlant',
    title: 'Native Plants',
    icon: GiFlowerEmblem,
    type: 'document',
    // orderings: [
    //     {
    //       title: 'Flo',
    //       name: 'releaseDateDesc',
    //       by: [
    //         {field: 'releaseDate', direction: 'desc'}
    //       ]
    //     },
    //     {
    //       title: 'Release Date, Old',
    //       name: 'releaseDateAsc',
    //       by: [
    //         {field: 'releaseDate', direction: 'asc'}
    //       ]
    //     },
    //     {
    //       title: 'Popularity',
    //       name: 'popularityDesc',
    //       by: [
    //         {field: 'popularity', direction: 'desc'}
    //       ]
    //     }
    //   ],
    fieldsets: [
        {
            name: 'name',
            title: 'Plant Name',
            options: { collapsible: true, collapsed: false },
        },
        {
            name: 'metadata',
            title: 'Plant Metadata',
            options: { collapsible: true, collapsed: false },
        },
        {
            name: 'description',
            title: 'Plant Description',
            options: { collapsible: true, collapsed: false },
        },
        {
            name: 'growingNearby',
            title: 'Habitat and Nearby Plants',
            options: { collapsible: true, collapsed: false },
        },
    ],
    preview: {
        select: {
            title: 'plantName.botanicalName',
            media: 'previewImage', // Use the previewImage field as thumbnail
        },
    },
    fields: [
        {
            name: 'plantName',
            title: 'Name',
            type: 'plantName',
            fieldset: 'name',
        },
        {
            name: 'bannerImage',
            title: 'Banner Image',
            type: 'figure',
            description: 'Add a wide-cropped image to use as the banner image on wider screens. A crop with an 8/5 is preferrable.',
            options: {
                validation: (Rule) => [Rule.required()],
                hotspot: true,
            },
            fieldset: 'name'
        },
        {
            name: 'slug',
            title: 'Slug',
            description:
                'A short, hyphenated version of the plant name for use in URLs. Generated slugs will have the format of common-name-botanical-name. Keep in mind that changing the slug of a published page will break any existing links to it both on the site and elswewhere.',
            type: 'slug',
            validation: (Rule) => Rule.required(),
            options: {
                source: (doc) =>
                    `${doc.plantName.commonName}-${doc.plantName.botanicalName}`,
                validation: (Rule) => [Rule.unique()],
                slugify: (input) =>
                    input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
            },
            fieldset: 'metadata',
        },
        {
            name: 'plantIdentificationTags',
            type: 'array',
            title: 'Plant Identification Tags',
            description:
                'Add one or more features by which to identify this plant. Keep it short (hit Enter for each one). ',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            fieldset: 'metadata',
        },
        {
            name: 'metaDescription',
            type: 'text',
            title: 'Meta-description',
            validation: [(Rule) => Rule.required(), (Rule) => Rule.max(160), (Rule) => Rule.min(40)],
            description:
                'Add very brief description (one or two sentences) of this plant for search engines and to be presented when it is being featured on the site as a teaser section, like "Blooming Now".',
            fieldset: 'metadata',
        },
        {
            name: 'previewImage',
            title: 'Plant Thumbnail Image',
            description:
                "Choose an image for this plant. Should be a portrait crop (3/4 aspect ratio).",
            type: 'figure',
            options: {
                hotspot: true, // <-- Defaults to false
            },
            fieldset: 'metadata',
        },
        {
            name: 'images',
            type: 'array',
            title: 'Plant Image Gallery',
            description:
                "Upload or select images of this plant to appear in a gallery on the plant's page.",
            of: [{ type: 'figure' }],
            options: { sources: [AssetSource] },
            fieldset: 'description',
        },
        {
            name: 'lede',
            title: 'Plant Lede',
            description:
                "Add the lede for this plant's page. Ledes are typically between 30-40 words.",
            type: 'pageBodyPortableText',
            fieldset: 'description',
        },
        {
            name: 'bloomText',
            title: 'Bloom description',
            description:
                "Add any information about the plant's bloom.",
            type: 'pageBodyPortableText',
            fieldset: 'description',
        },
        {
            name: 'description',
            title: 'Plant Description',
            description:
                "Add a plant description to serve as the main text content on this plant's page. Images and other content can also be embedded.",
            type: 'pageBodyPortableText',
            fieldset: 'description',
        },
        {
            name: 'flowerColor',
            title: 'Flower Color',
            type: 'string',
            options: {
                list: [
                    { title: 'White', value: 'white' },
                    { title: 'Blue', value: 'blue' },
                    { title: 'Purple', value: 'purple' },
                    { title: 'Pink', value: 'pink' },
                    { title: 'Red', value: 'red' },
                    { title: 'Orange', value: 'orange' },
                    { title: 'Yellow', value: 'yellow' },
                    { title: 'Brown', value: 'brown' },
                    { title: 'Green', value: 'green' },
                ],
                layout: 'radio', // <-- defaults to 'dropdown'
            },
            fieldset: 'description',
        },
        {
            name: 'floweringMonths',
            title: 'Flowering Months',
            type: 'array',
            of: [{type: 'number'}],
            options: {
                list: [
                    { title: 'January', value: 1 },
                    { title: 'February', value: 2 },
                    { title: 'March', value: 3 },
                    { title: 'April', value: 4 },
                    { title: 'May', value: 5 },
                    { title: 'June', value: 6 },
                    { title: 'July', value: 7 },
                    { title: 'August', value: 8 },
                    { title: 'September', value: 9 },
                    { title: 'October', value: 10 },
                    { title: 'November', value: 11 },
                    { title: 'December', value: 12 },
                ], // <-- predefined values
            },
            fieldset: 'description',
        },
        {
            name: 'floweringSeason',
            title: 'Flowering Season',
            description: 'Choose a season to associate this plant with. This will determine the season page it appears on.',
            type: 'string',
            options: {
                list: [
                    { title: 'Spring', value: 'spring' },
                    { title: 'Summer', value: 'summer' },
                    { title: 'Fall', value: 'fall' },
                    { title: 'Winter', value: 'winter' },
                ], // <-- predefined values
            },
            fieldset: 'description',
        },
        {
            name: 'conservationStatus',
            title: 'Conservation Status',
            description:
                "Add any information about the plant's conservation status.",
            type: 'pageBodyPortableText',
            fieldset: 'description',
        },
        {
            name: 'habitat',
            title: 'Habitat',
            type: 'pageBodyPortableText',
            fieldset: 'growingNearby',
        },
        {
            name: 'growingNearbyPlantList',
            title: 'Native plants growing nearby',
            type: 'array',
            description:
                'Hit Enter to delineate each one. Only published native plants can be referenced.',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'nativePlant' }],
                },
            ],
            fieldset: 'growingNearby',
        },
        {
            name: 'growingNearbyText',
            title: "What's growing nearby?",
            description:
                "Add any additional information about what's growing near this plant.",
            type: 'pageBodyPortableText',
            fieldset: 'growingNearby',
        },
        {
            name: 'tidbits',
            title: 'Interesting Tidbits',
            type: 'pageBodyPortableText',
            fieldset: 'description',
        },
    ],
};
