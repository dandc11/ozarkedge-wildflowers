import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import cx from 'classnames';
import { getImagePaletteBackgroundColor } from '@lib/utilities/imageUtil';
import CircleHeader from './CircleHeader';

const SeasonsPreview = (props) => {
    const { seasonData } = props;
    console.log('season data in preview ', seasonData);
    const { mainImage, seasonName } = seasonData;
    const seasonAccentColor = getImagePaletteBackgroundColor(
        mainImage,
        'lightVibrant'
    );
    return (
        <div
            className={'seasons-preview relative my-10'}
            // style={{ backgroundColor: sectionBgColor }}
        >
            <CircleHeader
                id={`seasonPreviewHeader`}
                wrapperClasses={`season-header-wrapper`}
                headerClasses={`season-header white`}
                firstLetter
                accentColor={seasonAccentColor}
            >
                {seasonName.charAt(0).toUpperCase() + seasonName.slice(1)} at
                Ozarkedge
            </CircleHeader>
            <ResponsiveImage
                className={`featured-image w-full h-auto rounded-none`}
                wrapperClasses={`season-img`}
                placeholder="empty"
                // slug={plant.slug.current}
                // blurDataURL={plant.previewImage.asset.lqip}
                // style={{
                //     width: '100%',
                //     height: '100%',
                // }}
                sizes="(max-width: 700px) 90vw, 700px"
                image={mainImage.asset}
                alt={mainImage.alt}
            />
            <p className={'season-body'}></p>
            <br></br>
            <Link href="/seasons" className={`seasons-page-link mt-5 px-7 mb-0`}>
                Read more aobut seasons
            </Link>
        </div>
    );
};

SeasonsPreview.propTypes = {};

export default SeasonsPreview;
