import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getCurrentSeason } from '@lib/utilities/helperUtil';
import TableOfContents from './TableOfContents';

const Header = (props) => {
    const {
        absolute = false,
        children,
        circleColorClass,
        className = '',
        headerClassName = '',
        id,
        showCircle = false,
        tocLinks = null,
    } = props;
    const tableOfContentsRef = useRef(null);
    const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false);
    const toggleTableOfContents = () => {
        setTableOfContentsOpen(!tableOfContentsOpen);
    };

    const onClickOutside = (e) => {
        if (
            tableOfContentsRef.current &&
            !tableOfContentsRef.current.contains(e.target) &&
            tableOfContentsRef.current !== e.target &&
            !e.target.classList.contains('header-circle')
        ) {
            setTableOfContentsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', onClickOutside);
        return () => document.removeEventListener('click', onClickOutside);
    }, []);

    const currentSeason = getCurrentSeason();
    const circleColor = circleColorClass
        ? `${circleColorClass}`
        : currentSeason.ACCENT_COLOR_CLASS;
    const circleClassName = cx(
        'header-circle absolute font-normal w-[45px] h-[45px] rounded-full -z-10 opacity-90 hover:opacity-100 hover:scale-110 transition-all ease-in duration-150 -top-6 -left-8 bp-700:w-[50px] bp-700:h-[50px] bp-700:-top-6 bp-700:-left-10 bp-1000:w-[55px] bp-1000:h-[55px] bp-1000:-top-8 bp-1000:-left-10',
        { 'cursor-pointer': tocLinks != null, 'z-50': tableOfContentsOpen },
        circleColor
    );

    return (
        <div
            id={id}
            className={cx('header-base', { absolute: absolute }, className)}
        >
            <h2 className={cx('relative', headerClassName)}>
                {' '}
                {showCircle && (
                    <div
                        className={circleClassName}
                        onClick={toggleTableOfContents}
                    ></div>
                )}
                {tocLinks && (
                    <div
                        ref={tableOfContentsRef}
                        className={cx(
                            'absolute grid transition-z-50 transition-all duration-500 ease-in-out',
                            {
                                'z-50 grid-rows-[1fr]': tableOfContentsOpen,
                                'grid-rows-[0fr]': !tableOfContentsOpen,
                            }
                        )}
                    >
                        <div className="overflow-hidden relative">
                            <TableOfContents
                                className={cx('')}
                                links={tocLinks}
                            />
                        </div>
                    </div>
                )}
                {children}
            </h2>
        </div>
    );
};

Header.propTypes = {};

export default Header;
