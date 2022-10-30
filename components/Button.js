import React from 'react';

const handleClick = (link) => {};

const Button = (
    { type = 'button', classes, link = '', children },
    ...props
) => {
    let classArray = classes.join(' ');
    return (
        <button
            className={`btn ${classes}`}
            type={`${type}`}
            onClick={handleClick(link)}
        >
            {children}
        </button>
    );
};

Button.defaultProps = {
    classes: [],
};

Button.propTypes = {};

export default Button;
