export default {
    name: 'button',
    title: 'Button',
    type: 'object',
    fields: [
        {
            name: 'buttonLabel',
            title: 'Button Text',
            type: 'string',
        },
        {
            name: 'buttonLink',
            title: 'Link',
            description: 'The path to navigate to when the button is pressed.',
            type: 'link',
        },
    ],
};
