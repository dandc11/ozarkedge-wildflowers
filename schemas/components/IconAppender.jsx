import React from 'react';

const IconAppender = ({children, iconType}) => {
    let icon;
    switch(iconType) {
        case 'internalLink':
            icon = '🔗';
            break;
        case 'hightlight':
            icon = '🖌️';
            break;
        case 'externalLink':
            icon = '🌐';
            break;
        default:
            icon = '🔗';
    }

    return <span>{children} {icon}</span>
}
                
export default IconAppender;