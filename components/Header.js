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
        'group absolute font-normal w-[45px] h-[45px] rounded-full -z-10 opacity-90 hover:opacity-100 hover:scale-110 transition-all ease-in duration-150 -top-6 -left-8 bp-700:w-[50px] bp-700:h-[50px] bp-700:-top-6 bp-700:-left-10 bp-1000:w-[55px] bp-1000:h-[55px] bp-1000:-top-8 bp-1000:-left-10',
        { 'cursor-pointer': tocLinks != null, 'z-50': showToC },
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
                {tocLinks && (
                    <div className={cx('transition-z-50 transition-hidden ease-in-out duration-175',{'z-50': showToC, 'hidden': !showToC})} onClick={() => setShowToC()}>
                        <TableOfContents
                            className={cx('absolute')}
                            links={tocLinks}
                        />
                    </div>
                )}
                {children}
            </h2>
        </div>
    );
};

Header.propTypes = {};

export default Header;
