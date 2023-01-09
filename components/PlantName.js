import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const PlantName = (props) => {
    const {
        plantName,
        showBotanicalName = true,
        showCommonName = true,
        showSeparator = true,
    } = props;
    return (
        <div className={`featured-name my-6 mx-0 w-full`}>
            {showCommonName && (
                <h3
                    className={`common-name font-display font-semibold whitespace-nowrap text-xl pb-1 text-center bp-600:text-center bp-600:pb-1 bp-600:text-xl ${cx(
                        {
                            'border-b border-black border-solid':
                                showSeparator,
                        }
                    )}`}
                >
                    {plantName.commonName}
                </h3>
            )}
            {showBotanicalName && (
                <h4
                    className={`botanical-name font-body italic pt-1 font-normal text-base text-center bp-600:pt-1 bp-600:text-xl`}
                >
                    {plantName.botanicalName}
                </h4>
            )}
        </div>
    );
};

PlantName.propTypes = {};

export default PlantName;
