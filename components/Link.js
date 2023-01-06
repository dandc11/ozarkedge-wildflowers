import React from 'react';
import Link from 'next/link';
import { getInternalLinkFullPath } from '@lib/utilities/helperUtil';

export default ({ docType = undefined, href = '', children }) => {
    // if the href value passed has an internal link slug, check to see if it needs a path prefix, e.g. /native-plants/
    const slug = href.internal ? href.internal : href;
    const path = docType ? getInternalLinkFullPath(docType, slug) : '';
    return (
        <>
            {href?.external && (
                <a
                    href={href.external}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            )}
            {/* non-authored internal links */}
            {href && <Link href={path}>{children}</Link>}{' '}
        </>
    );
};
