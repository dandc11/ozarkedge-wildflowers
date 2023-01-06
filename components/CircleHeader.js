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
    const wrapperClassNames = cx(wrapperClasses, 'circle-header-wrapper');
    const headerClassNames = cx(
        headerClasses,
        { 'show-circle': showCircle },
        {'first-letter': firstLetter},
        'circle-header'
    );
    const style = {}
    return (
        <div
            id={id}
            className={wrapperClassNames}
            style={accentColor ? { '--accent-color': accentColor } : undefined}
        >
            <h2 className={headerClassNames}>{children}</h2>
        </div>
    );
};

CircleHeader.propTypes = {};

export default CircleHeader;
