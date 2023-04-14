import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from './ResponsiveImage';
import cx from 'classnames';

const ThumbnailGrid = (props) => {
    const { assets, rows, cols, maxItems } = props;
    console.log(maxItems)
    const gridRows = `grid-rows-${rows}`;
    const gridCols = `grid-cols-${cols}`;
    const thumbnails = maxItems ? assets.slice(0, maxItems) : assets;
    return (
        <ul className={cx(`grid auto-cols-min ${gridCols} gap-2 `)}>
        {thumbnails.map((imageAsset) => (
            <li key={imageAsset.id}>
                <ResponsiveImage
                    figureClassName="rounded-md"
                    className={cx('thumbnail', 'small')}
                    image={imageAsset}
                    width={100}
                    showCaption={false}
                />
            </li>
        ))}
    </ul>

    );
};

ThumbnailGrid.propTypes = {};

export default ThumbnailGrid;
