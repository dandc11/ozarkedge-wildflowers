import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getCurrentSeason } from '@lib/utilities/helperUtil';

const Header = (props) => {
    const {
        id,
        circleColorClass,
        wrapperClasses = '',
        headerClasses = '',
        spanClasses = '',
        absolute = false,
        firstLetter = false,
        showCircle = false,
        spanText,
        children,
    } = props;
    const currentSeason = getCurrentSeason();
    const circleColor = circleColorClass
        ? `${circleColorClass}`
        : currentSeason.ACCENT_COLOR_CLASS;
    const circleClassNames = cx(
        'absolute font-normal w-[40px] h-[40px] rounded-full -z-10 -top-4 -left-6 bp-800:w-[50px] bp-800:h-[50px] bp-800:-top-7 bp-800:-left-8',
        circleColor
    );
    const headerClassNames = cx(
        {
            'first-letter:relative first-letter:text-5xl first-letter:font-display first-letter:font-semibold':
                firstLetter,
        },
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
                {showCircle && <div className={circleClassNames}></div>}
                {spanText && (
                    <span
                        className={cx(
                            spanClasses
                        )}
                    >
                        {spanText}
                    </span>
                )}{' '}
                {children}
            </h2>
        </div>
    );
};

Header.propTypes = {};

export default Header;
