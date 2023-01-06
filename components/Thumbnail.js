import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from './ResponsiveImage';

const Thumbnail = (props) => {
    const { plantName, image, slug, description, size } = props;
    const classes = [size, classes].join(' ');
    return (
        <div className={classes}>
            <ResponsiveImage className={classes} image={image.asset} />
        </div>
    );

    // return <div></div>
};

Thumbnail.propTypes = {};

export default Thumbnail;
