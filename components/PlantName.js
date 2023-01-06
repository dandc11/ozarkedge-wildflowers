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
        <div className={`featured-name`}>
            {showCommonName && (
                <h3 className={`common-name ${cx({'separator': showSeparator})}`}>{plantName.commonName}</h3>
            )}
            {showBotanicalName && (
                <h4 className={`botanical-name`}>
                    {plantName.botanicalName}
                </h4>
            )}
        </div>
    );
};

PlantName.propTypes = {};

export default PlantName;
 