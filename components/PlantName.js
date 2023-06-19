import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { titleCase } from '@lib/utilities/helperUtil';

const TopHeader = (headingLevel, children, classnames) => {
    return (
        <></>
    )
}

const PlantName = (props) => {
    const {
        plantName,
        align = 'center',
        headingLevel='1',
        showBotanicalName = true,
        showCommonName = true,
        showSeparator = true,
        className,
        topNameClassName,
        bottomNameClassName,
    } = props;
    return (
        <div
            className={cx(
                `py-3 mx-0 inline text-center`,
                className
            )}
        >
            {showCommonName && (
                <h3
                    className={cx(
                        `common-name font-display font-semibold text-2xl pb-1 bp-600:pb-1 bp-700:text-3xl`,
                        topNameClassName
                    )}
                >
                    {titleCase(plantName?.commonName)}
                </h3>
            )}
            {showSeparator && (
                <hr className={`w-full border-gray-800 border-solid border-t-[1px]`}></hr>
            )}
            {showBotanicalName && (
                <h4
                    className={cx(
                        `botanical-name italic pt-1 font-normal text-base text-center bp-600:pt-1 bp-700:text-xl`,
                        bottomNameClassName
                    )}
                >
                    {titleCase(plantName?.botanicalName)}
                </h4>
            )}
        </div>
    );
};

PlantName.propTypes = {};

export default PlantName;
