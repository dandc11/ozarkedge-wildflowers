import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import cx from 'classnames';

const TableOfContents = (props) => {
    const { className, links, showHeader = false, callBack } = props;
    const linkHrefs = Object.keys(links);
    const linkTitles = Object.values(links);
    const handleCallBack = callBack ? callBack : () => {};
    return (
        <>
            {linkHrefs?.length > 0 && (
                <div
                    className={cx(
                        'px-6 py-6 bg-white z-30 w-72 flex flex-col',
                        className
                    )}
                >
                    {showHeader && (
                        <h4
                            className={`text-2xl font-extralight not-italic uppercase`}
                        >
                            Table of Contents
                        </h4>
                    )}
                    <ol>
                        {linkHrefs.map((href, index) => (
                            <li className={`mb-3`} key={href}>
                                <a
                                    href={`#${href}`}
                                    onClick={() => handleCallBack() }
                                    className={`text-lg font-extralight not-italic uppercase underline underline-offset-2 decoration-1 hover:font-normal`}
                                >
                                    {linkTitles[index]}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </>
    );
};

TableOfContents.propTypes = {};

export default TableOfContents;
