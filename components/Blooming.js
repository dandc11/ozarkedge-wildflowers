import React, { useState } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { getCurrentMonthName, titleCase } from '../utilities/helperUtil';
import Header from './Header';
import Button from './Button';
import PortTextWrapper from './PortableText';

import cx from 'classnames';
import Link from 'next/link';
import ImageSlider from './ImageSlider';

const Blooming = (props) => {
    const { bloomingList, seasonData, className = '' } = props;
    const thisMonth = getCurrentMonthName();

    return (
        <>
            {bloomingList && (
                <section
                    id={`bloomingNow`}
                    className={cx(
                        `bp-800:flex justify-center w-full bg-oe-green-100`,
                        className
                    )}
                >
                    <div className="px-4 pt-4 flex-1 bp-800:max-w-xl">
                        <Header
                            id={`bloomingHeader`}
                            className={`w-full p-0 text-xl`}
                            headerClassName={`text-xl font-bold`}
                        >
                            <span className="text-3xl">BLOOMING</span> in
                            <span className="text-3xl">
                                {' '}
                                {titleCase(thisMonth)}
                            </span>
                        </Header>
                        <ImageSlider
                            className={`bp-800:hidden`}
                            sliderItems={bloomingList}
                            useLinks
                        />
                        {seasonData?.description && (
                            <div className={``}>
                                <PortTextWrapper
                                    className={``}
                                    value={seasonData.description}
                                    components={{}}
                                />
                            </div>
                        )}
                    </div>
                    <div
                        id={`bloomingSliderContainer`}
                        className={`hidden bp-800:block relative flex-1 min-h-[530px] overflow-auto w-full max-w-3xl hide-scroll`}
                    >
                        <ul
                            id={`bloomingList`}
                            className={cx('absolute left-0 w-full grid grid-flow-row-dense grid-cols-2 bp-1000:grid-cols-3 justify-items-start gap-1')}
                        >
                            {bloomingList.map((plant, index) => (
                                <li
                                    className={cx()}
                                    key={
                                        index +
                                        plant.plantName?.commonName?.trim()
                                    }
                                >
                                    <div>
                                        <Link
                                            href={`/native-plants/${plant.slug}`}
                                        >
                                            <ResponsiveImage
                                                className={`featured-image w-full object-cover aspect-[8/6] h-auto max-w-[16rem] max-bp-800:min-w-[85vw] bp-800:aspect-[3/4] bp-800:h-auto`}
                                                wrapperClassName={`blooming-plant-img relative transition ease-in-out delay-150`}
                                                figureClassName={`rounded-none`}
                                                captionBgClassName={`bg-oe-green-100`}
                                                blurDataURL={
                                                    plant.image?.asset?.lqip
                                                }
                                                sizes="(max-width: 799px) 144px, 700px"
                                                image={plant.image}
                                            />
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </>
    );
};

export default Blooming;
