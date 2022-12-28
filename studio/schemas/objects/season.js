export default {
    name: 'season',
    title: 'Season',
    type: 'document',
    fields: [
        {
            name: 'seasonName',
            title: 'Season',
            type: 'string',
            options: {
                list: [
                    { title: 'Spring', value: 'spring' },
                    { title: 'Summer', value: 'summer' },
                    { title: 'Fall', value: 'fall' },
                    { title: 'Winter', value: 'winter' },
                ],
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'monthNumbers',
            title: 'Season Months',
            description: 'These are the months used for this season. Plants\' flowering months will be matched to these to determine the season the plant corresponds to. This field is read-only to prevent accidental changes.',
            hidden: true,
            readOnly: true,
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
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Season Description',
            description: 'Add body text content about this season here.',
            type: 'plantPortableText',
        },
        {
            name: 'mainImage',
            title: 'Main Image',
            description:
                'Add an image to depict this season in the page banner.',
            type: 'figure',
        },
        {
            name: 'seasonPlants',
            title: 'Plants Flowering in this Season',
            type: 'array',
            // readOnly: true,
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'nativePlant' }],
                    options: {
                        filter: 'season == $season',
                        filterParams: {season: 'floweringSeason'}
                      }
                },
            ],
            validation: (Rule) => Rule.unique(),
        },
    ],
};
