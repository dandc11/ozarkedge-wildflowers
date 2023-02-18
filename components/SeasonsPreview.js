import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import PortTextWrapper from './PortableText';
import cx from 'classnames';
import { getImagePaletteBackgroundColor } from '@lib/utilities/imageUtil';
import { titleCase } from '@lib/utilities/helperUtil';
import Header from './Header';

const SeasonsPreview = (props) => {
    const { seasonData, className } = props;
    const { mainImage, seasonName } = seasonData;
    const seasonAccentColor = getImagePaletteBackgroundColor(
        mainImage,
        'lightVibrant'
    );
    return (
        <section id={`seasonPreview`} className={cx(`relative`, className)}>
            <Header
                id={``}
                wrapperClasses={`z-20 bg-yellow-100 px-4 bp-800:hidden bp-800:px-0 bp-800:pb-4 bp-800:ml-6 bp-800:relative`}
                headerClasses={`season-header bp-800:bg-transparent `}
                spanClasses={`bp-800:bg-transparent`}
                showCircle
                spanText={titleCase(seasonName)}
            >
                at Ozarkedge
            </Header>
            <div className={`flex flex-col bp-800:flex-row bp-800:gap-6`}>
                <div
                    id={`seasonPreviewText`}
                    className={`order-2 bp-800:order-1 bp-800:max-w-sm bp-1100:max-w-xl`}
                >
                    <Header
                        id={``}
                        wrapperClasses={`hidden bp-800:block z-20 bg-yellow-100 px-4 bp-800:pb-4 bp-800:relative`}
                        headerClasses={`season-header bp-800:bg-transparent `}
                        spanClasses={`bp-800:bg-transparent`}
                        showCircle
                        spanText={titleCase(seasonName)}
                    >
                        at Ozarkedge
                    </Header>
                    {seasonData.description && (
                        <div className={`px-4 pt-6 bp-800:p-0`}>
                            <PortTextWrapper
                                value={seasonData.description}
                                components={{}}
                            />
                        </div>
                    )}
                    <br></br>
                    <Link
                        href="/seasons"
                        className={`seasons-page-link font-semibold underline px-4 bp-800:px-0`}
                    >
                        Read more aobut seasons
                    </Link>
                </div>
                <ResponsiveImage
                    wrapperClassName={`order-1 bp-800:w-full bp-800:order-2`}
                    className={`featured-image h-auto rounded-none w-full bp-800:rounded-md bp-800:order-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                />
            </div>
        </section>
    );
};

SeasonsPreview.propTypes = {};

export default SeasonsPreview;
