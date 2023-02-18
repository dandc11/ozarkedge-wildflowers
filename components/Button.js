import React from 'react';
import { useRouter } from 'next/router';
import { getInternalLinkFullPath } from '@lib/utilities/helperUtil';
import cx from 'classnames';

const Button = (
    {
        type = 'button',
        className,
        linkDocType='',
        internalLink = '',
        externalLink = '',
        callBack = null,
        children,
    },
    ...props
) => {
    // TODO : handle external links?
    const router = useRouter();
    const path = getInternalLinkFullPath(linkDocType, internalLink);
    return (
        <button
            className={cx(className)}
            type={`${type}`}
            onClick={internalLink !== '' ? () => router.push(path) : callBack}
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
