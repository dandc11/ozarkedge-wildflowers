import { PortableText } from '@portabletext/react';
import { DOCTYPE_PATH_PREFIXES } from '@lib/utilities/constants';
import { getInternalLinkFullPath } from '@lib/utilities/helperUtil';
import ResponsiveImage from './ResponsiveImage';
import cx from 'classnames';
import Link from 'next/link';

const portTextComponents = {
    block: {
        // Ex. 1: customizing common block types
        h2: ({ children }) => <h1 className="text-2xl">{children}</h1>,
        h3: ({ children }) => <h1 className="text-xl">{children}</h1>,
        h4: ({ children }) => <h1 className="text-lg">{children}</h1>,
        normal: ({ children }) => (
            <p className="pt-3">
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-purple-500">
                {children}
            </blockquote>
        ),
    },
    types: {
        figure: ({ value }) => (
            <ResponsiveImage
                className={`z-0`}
                figureClassName={`rounded-none mt-4`}
                captionClassName={`absolute`}
                image={value}
                priority={false}
                placeholder={``}
                showCaption={true}
                wrapperClassName={`flex justify-center`}
                // quality={`100`}
            />
        ),
    },
    list: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => <ul className={`mt-2`}>{children}</ul>,
        number: ({ children }) => (
            <ol className={`mt-2 list-decimal`}>{children}</ol>
        ),

        // Ex. 2: rendering custom lists
        checkmarks: ({ children }) => (
            <ol className="m-auto text-lg">{children}</ol>
        ),
    },
    listItem: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => (
            <li
                className={`list-item list-inside`}
                style={{ listStyleType: ' disclosure-closed' }}
            >
                {children}
            </li>
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
        <div className={cx(`port-text`, className)}>
            <PortableText value={props.value} components={portTextComponents} />
        </div>
    );
};

export default PortTextWrapper;
