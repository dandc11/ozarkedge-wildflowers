import React from 'react';

import ResponsiveImage from './ResponsiveImage';
import cx from 'classnames';

const ThumbnailGrid = (props) => {
    const { assets, className, cols=3, maxItems, thumbnailWidth = 100, lightboxIdentifier = '' } = props;
    const gridColumns = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    }

    return (
        <ul className={cx(`grid ${gridColumns[cols]} gap-2`, className)}>
        {assets.map((imageAsset, index) => (
            <li key={index} className={cx({'hidden': index + 1 > maxItems})}>
                <ResponsiveImage
                    figureClassName="rounded-md"
                    className={cx('thumbnail', 'small')}
                    image={imageAsset}
                    showCaption={false}
                    sizes={`(max-width: 450px) 33vw, 140px`}
                    lightboxIdentifier={lightboxIdentifier}
                />
            </li>
        ))}
    </ul>

    );
};

export default ThumbnailGrid;
