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
            <div className={`flex flex-col bp-800:flex-row bp-800:gap-6`}>
                <div
                    id={`seasonPreviewText`}
                    className={`order-2 bp-800:order-1 bp-800:max-w-xs bp-1100:max-w-xl`}
                >
                    <Header
                        id={``}
                        className={`hidden bp-800:block z-20 px-4 relative`}
                        headerClassName={`season-header bp-800:bg-transparent `}
                        spanClasses={`bp-800:bg-transparent`}
                        showCircle
                        spanText={titleCase(seasonName)}
                    >
                        at Ozarkedge
                    </Header>
                    {/* {seasonData.description && (
                        <div className={`px-4 pt-6 bp-800:p-0`}>
                            <PortTextWrapper
                                value={seasonData.description}
                                components={{}}
                            />
                        </div>
                    )}
                    <br></br> */}
                    <Link
                        href="/seasons"
                        className={`seasons-page-link font-semibold underline px-4 bp-800:px-0`}
                    >
                        Read more aobut seasons
                    </Link>
                </div>
                <ResponsiveImage
                    wrapperClassName={`relative order-1 bp-800:w-full bp-800:order-2 b`}
                    className={`featured-image h-auto w-full bp-800:order-2`}
                    figureClassName={`rounded-none bp-1200:rounded-md `}
                    placeholder="empty"
                    image={mainImage.asset}
                    sizes={`(max-width: 800px) 100vw, 670px`}
                    alt={mainImage.alt}
                >
                    <Header
                        id={``}
                        className={`absolute bottom-0 bg-transparent px-4 pt-2 bp-800:hidden`}
                        headerClassName={`season-header text-white`}
                        spanClasses={`text-white`}
                        spanText={titleCase(seasonName)}
                    >
                        at Ozarkedge
                    </Header>
                </ResponsiveImage>
            </div>
        </section>
    );
};

SeasonsPreview.propTypes = {};

export default SeasonsPreview;
