import { PortableText } from '@portabletext/react';
import { DOCTYPE_PATH_PREFIXES } from '@lib/utilities/constants';
import { getInternalLinkFullPath } from '@lib/utilities/helperUtil';
import cx from 'classnames';
import Link from 'next/link';

const portTextComponents = {
    types: {
        image: ({ value }) => <img src={value.imageUrl} />,
    },
    list: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => <ul className={`mt-2`}>{children}</ul>,
        number: ({ children }) => <ol className={`mt-2 list-decimal`}>{children}</ol>,

        // Ex. 2: rendering custom lists
        checkmarks: ({ children }) => (
            <ol className="m-auto text-lg">{children}</ol>
        ),
    },
    listItem: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => (
            <li className={`list-item list-inside`} style={{ listStyleType: ' disclosure-closed' }}>{children}</li>
        ), 
        number: ({ children }) => (
            <li className={`list-item list-inside`}>{children}</li>
        ), 

        // Ex. 2: rendering custom list items
        checkmarks: ({ children }) => <li>✅ {children}</li>,
    },
    marks: {
        internalLink: ({ children, value }) => {
            const href = getInternalLinkFullPath(
                value?.docType,
                value?.slug?.current
            );
            return (
                <Link className={`underline text-blue-500`} href={href}>
                    {children}
                </Link>
            );
        },
        externalLink: ({ children, value }) => {
            console.log('value', value);
            const href = value?.href || '';
            return (
                <a
                    className={`underline text-blue-500`}
                    href={href}
                    target={value?.blank ? 'blank' : ''}
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            );
        },
    },
};

const PortTextWrapper = (props) => {
    const { className } = props;
    return (
        <div className={cx(className)}>
            <PortableText value={props.value} components={portTextComponents} />
        </div>
    );
};

export default PortTextWrapper;
