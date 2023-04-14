import React from 'react';
import PropTypes from 'prop-types';

import { getCurrentSeason } from '@lib/utilities/helperUtil';
import cx from 'classnames';

const TableOfContents = (props) => {
    const {
        className,
        headerClassName,
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
        'group max-[700px]:hidden absolute -z-10 font-normal w-[40px] h-[40px] hover:scale-110 rounded-full -z-10 bp-800:hover:scale-110 ease-in duration-300 -top-4 -left-7 bp-800:-top-4 bp-800:-left-7',
        circleColor
    );
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
                            className={cx(`relative z-10 text-2xl font-extralight not-italic uppercase`, headerClassName)}
                        >
                            {showCircle && (
                                <div
                                    className={circleClassNames}
                                ></div>
                            )}
                            Table of Contents
                        </h4>
                    )}
                    <ol>
                        {linkHrefs.map((href, index) => (
                            <li className={cx(`mb-3 bp-700:mb-1 `, listItemClassName)} key={href}>
                                <a
                                    href={`#${href}`}
                                    onClick={() => handleCallBack()}
                                    className={`text-lg font-extralight not-italic uppercasehover:font-normal`}
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
