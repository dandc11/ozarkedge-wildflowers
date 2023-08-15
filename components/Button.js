import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getInternalLinkFullPath } from '../utilities/helperUtil';
import cx from 'classnames';

const ChevronDown = () => {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                className="w-8 h-8 my-1"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
            </svg>
        </>
    );
};
const ChevronUp = () => {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
            </svg>
        </>
    );
};
const Button = (
    {
        type = 'button',
        buttonIcon = '',
        expanded = '',
        className,
        linkDocType = '',
        internalLink = '',
        externalLink = '',
        callBack = null,
        children,
    },
    ...props
) => {
    // TODO : handle external links?
    const clickHandler = () => {
        if (callBack !== null) {
            callBack();
        }
        if (internalLink !== '') {
            () => router.push(path);
        }
    };
    const router = useRouter();
    const path = getInternalLinkFullPath(linkDocType, internalLink);
    return (
        <button
            className={cx(
                { 'btn-expand': buttonIcon === 'expand' },
                className,
                'flex justify-center'
            )}
            type={`${type}`}
            onClick={() => clickHandler()}
        >
            {children}
            {buttonIcon === 'expand' && !expanded && <ChevronDown />}
            {buttonIcon === 'expand' && expanded && <ChevronUp />}
        </button>
    );
};

Button.defaultProps = {
    classes: [],
};

export default Button;
