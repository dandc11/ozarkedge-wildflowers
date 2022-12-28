import React from 'react';
import PropTypes from 'prop-types';

const PlantName = (props) => {
    const { plant } = props;
    return (
        <div className={`featured-name`}>
            <h3 className={`common-name`}>
                {plant.plantName.commonName}
            </h3>
            <h4 className={`botanical-name`}>
                {plant.plantName.botanicalName}
            </h4>
        </div>
    );
};

PlantName.propTypes = {};

export default PlantName;
