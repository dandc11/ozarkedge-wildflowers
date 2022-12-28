import React from 'react';
import { useRouter } from 'next/router';

const Button = (
    {
        type = 'button',
        classes,
        internalLink = '',
        externalLink = '',
        callBack = null,
        children,
    },
    ...props
) => {
    // TODO : handle external links?
    const router = useRouter();
    let classArray = classes.join(' ');
    return (
        <button
            className={`btn ${classArray}`}
            type={`${type}`}
            onClick={internalLink !== '' ? () => router.push(internalLink) : callBack}
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
