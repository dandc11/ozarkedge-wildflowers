import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { titleCase } from '@lib/utilities/helperUtil';

const PlantName = (props) => {
    const {
        plantName,
        align = 'center',
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
                `py-3 mx-0 w-full text-center`,
                className
            )}
        >
            {showCommonName && (
                <h3
                    className={cx(
                        `common-name font-display font-semibold whitespace-nowrap text-2xl pb-1 bp-600:pb-1 bp-700:text-3xl`,
                        topNameClassName
                    )}
                >
                    {titleCase(plantName?.commonName)}
                </h3>
            )}
            {showSeparator && (
                <hr className={`border-t-[1px] border-gray-800`}></hr>
            )}
            {showBotanicalName && (
                <h4
                    className={cx(
                        `botanical-name italic pt-1 font-normal text-base text-center bp-600:pt-1 bp-600:text-xl`,
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
