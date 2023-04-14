import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from './ResponsiveImage';
import cx from 'classnames';

const ThumbnailGrid = (props) => {
    const { assets, cols=3, maxItems, thumbnailWidth = 100 } = props;
    const gridColumns = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    }
    const thumbnails = maxItems ? assets.slice(0, maxItems) : assets;
    return (
        <ul className={cx(`grid ${gridColumns[cols]} gap-2`)}>
        {thumbnails.map((imageAsset, index) => (
            <li key={index}>
                {/* <p>something</p> */}
                <ResponsiveImage
                    figureClassName="rounded-md"
                    className={cx('thumbnail', 'small')}
                    image={imageAsset}
                    width={thumbnailWidth}
                    showCaption={false}
                />
            </li>
        ))}
    </ul>

    );
};

ThumbnailGrid.propTypes = {};

export default ThumbnailGrid;
