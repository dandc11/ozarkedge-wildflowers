import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getCurrentSeason } from '@lib/utilities/helperUtil';
import TableOfContents from './TableOfContents';

const Header = (props) => {
    const {
        id,
        circleColorClass,
        wrapperClasses = '',
        headerClasses = '',
        spanClasses = '',
        absolute = false,
        showCircle = false,
        tocLinks = null,
        showToC,
        setShowToC,
        spanText,
        children,
    } = props;
    const currentSeason = getCurrentSeason();
    const circleColor = circleColorClass
        ? `${circleColorClass}`
        : currentSeason.ACCENT_COLOR_CLASS;
    const circleClassNames = cx(
        'group absolute font-normal w-[40px] h-[40px] hover:w-[45px] hover:h-[45px] rounded-full -z-10 bp-800:hover:w-[55px] bp-800:hover:h-[55px] ease-in duration-200 -top-4 -left-7 bp-800:w-[50px] bp-800:h-[50px] bp-800:-top-7 bp-800:-left-8',
        { 'cursor-pointer': tocLinks != null },
        circleColor
    );
    const headerClassNames = cx(
        headerClasses
    );
    return (
        <div
            id={id}
            className={cx(
                'header-base',
                { absolute: absolute },
                wrapperClasses
            )}
        >
            <h2 className={headerClassNames}>
                {' '}
                {showCircle && (
                    <div
                        className={circleClassNames}
                        onClick={() => setShowToC(spanText)}
                    ></div>
                )}
                {tocLinks && showToC && (
                    <div className="z-50" onClick={() => setShowToC()}>
                        <TableOfContents
                            className={'absolute'}
                            links={tocLinks}
                        />
                    </div>
                )}
                {spanText && (
                    <span className={cx(spanClasses)}>{spanText}</span>
                )}{' '}
                {children}
            </h2>
        </div>
    );
};

Header.propTypes = {};

export default Header;
