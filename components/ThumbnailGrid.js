import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from './ResponsiveImage';

const ThumbnailGrid = (props) => {
    const { assets, rows } = props;
    return (
        <div className={`thumbnail-grid ${rows === 1 ? 'row' : ''}`}>
            {assets &&
                assets.map(
                    (
                        { plantName, description, previewImage, slug } = asset,
                        index
                    ) => (
                        <ResponsiveImage className={['thumbnail', 'small']} slug={slug} image={previewImage.asset} key={index} />
                    )
                )}
        </div>
    );
};

ThumbnailGrid.propTypes = {};

export default ThumbnailGrid;
