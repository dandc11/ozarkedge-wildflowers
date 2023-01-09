import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const CircleHeader = (props) => {
    const {
        id,
        accentColor,
        wrapperClasses = '',
        headerClasses = '',
        firstLetter = false,
        showCircle = false,
        children,
    } = props;
    const circleAccentColor = accentColor ? `before:bg-[${accentColor}]` : 'bg-pink-500';
    const wrapperClassNames = cx(wrapperClasses);
    const headerClassNames = cx(
        headerClasses,
        { 'show-circle before:-z-10 before:absolute before:rounded-full before:w-20 before:h-20 before:top-0 before:-left-6 before:bg-white' : showCircle },
        // { : accentColor},
        {'first-letter:relative first-letter:text-5xl first-letter:font-display first-letter:font-semibold': firstLetter},
        'circle-header text-lg z-0 relative'
    );
    const style = {}
    console.log('accent color '. accentColor)
    return (
        <div
            id={id}
            className={wrapperClassNames + 'circle-header-wrapper absolute w-full z-10 whitespace-nowrap -top-14 left-4'}
            style={accentColor ? { '--accent-color': accentColor } : undefined}
        >
            <h2 className={headerClassNames}>{children}</h2>
        </div>
    );
};

CircleHeader.propTypes = {};

export default CircleHeader;
