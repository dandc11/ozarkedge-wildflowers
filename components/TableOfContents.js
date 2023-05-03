import React from 'react';
import PropTypes from 'prop-types';

import { getCurrentSeason } from '@lib/utilities/helperUtil';
import cx from 'classnames';

const TableOfContents = (props) => {
    const {
        className,
        headerClassName,
        shadow = true,
        links,
        listItemClassName = '',
        showHeader = false,
        showCircle = false,
        circleColorClass,
        callBack,
    } = props;
    const linkHrefs = Object.keys(links);
    const linkTitles = Object.values(links);
    const handleCallBack = callBack ? callBack : () => {};
    const currentSeason = getCurrentSeason();
    const circleColor = circleColorClass
        ? `${circleColorClass}`
        : currentSeason.ACCENT_COLOR_CLASS;
    const circleClassNames = cx(
        'group max-[700px]:hidden absolute -z-10 font-normal w-[40px] h-[40px] hover:scale-110 rounded-full -z-10 bp-800:hover:scale-110 ease-in duration-150 -top-4 -left-7 bp-800:-top-4 bp-800:-left-7',
        circleColor
    );
    return (
        <>
            {linkHrefs?.length > 0 && (
                <div
                    className={cx(
                        'pl-6 py-6 bg-white z-30 w-80 flex flex-col',
                        { 'shadow-md': shadow },
                        className
                    )}
                >
                    {showHeader && (
                        <h4
                            className={cx(
                                `relative z-10 text-3xl font-extralight not-italic uppercase`,
                                headerClassName
                            )}
                        >
                            {showCircle && (
                                <div className={circleClassNames}></div>
                            )}
                            Table of Contents
                        </h4>
                    )}
                    <ol>
                        {linkHrefs.map((href, index) => (
                            <li
                                className={cx(
                                    `mb-3 bp-700:mb-1 `,
                                    listItemClassName
                                )}
                                key={href}
                            >
                                <a
                                    href={`#${href}`}
                                    onClick={() => handleCallBack()}
                                    className={`text-lg font-extralight not-italic uppercase transition ease-in-out delay-150 hover:text-oe-blue-green-light-800 hover:border-b-2 hover:font-normal hover:border-b-oe-green-800 hover:transition-all bp-1200:text-xl`}
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
