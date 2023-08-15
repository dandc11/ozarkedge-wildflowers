import { GiHamburgerMenu } from 'react-icons/gi';

export default {
    name: 'menu',
    title: 'Menu',
    type: 'document',
    icon: GiHamburgerMenu,
    fields: [
        {
            name: 'title',
            type: 'string',
            readOnly: true
        },
        {
            name: 'menuItems',
            title: 'Menu Items',
            description: 'Add a title and image for each link in the menu.',
            type: 'array',
            of: [{ type: 'menuItem' }],
        },
    ],
}