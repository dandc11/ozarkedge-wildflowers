import React from 'react';

const handleLink = (link) => {

};

const Button = (
    { type = 'button', classes, link = '', callBack = null, children },
    ...props
) => {
    let classArray = classes.join(' ');
    return (
        <button
            className={`btn ${classes}`}
            type={`${type}`}
            onClick={callBack ? callBack : () => handleLink(link)}
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
