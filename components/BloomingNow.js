import React, { useState } from 'react';

import PropTypes from 'prop-types';
import PlantName from './PlantName';
import ResponsiveImage from './ResponsiveImage';
import { getCurrentMonthName, titleCase } from '@lib/utilities/helperUtil';
import Header from './Header';
import Button from './Button';
import PortTextWrapper from './PortableText';

import cx from 'classnames';

const BloomingNow = (props) => {
    const { plantList, className = '' } = props;
    const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
    const [currentPlant, setCurrentPlant] = useState(plantList[0]);
    const thisMonth = getCurrentMonthName();

    const changeCurrentPlant = (index) => {
        setCurrentPlant(plantList[index]);
    };
    return (
        <section
            id={`bloomingNow`}
            className={cx(
                `relative mb-24 bp-800:grid bp-800:grid-rows-[2rem_3rem_8rem_auto_auto_auto] bp-800:grid-cols-[8rem_8rem_auto] bg-oe-green-yelow-600 bp-800:bg-transparent bp-900:grid-cols-[8rem_11rem_auto] bp-1000:grid-cols-[20rem_6rem_auto] bp-1000:grid-rows-[4rem_4rem_6rem_auto_6rem] bp-1400:grid-cols-[20rem_10rem_auto] bp-1400:grid-rows-[4rem_4rem_6rem_auto_10rem]`,
                className
            )}
        >
            <Header
                id={`bloomingHeader`}
                wrapperClass={`absolute bp-800:static bp-800:row-start-1 bp-800:col-start-1 bp-800:col-span-2 top-[-1.8rem] bp-800:top-0`}
                headerClasses={`text-xl`}
                spanText={'BLOOMING'}
                showCircle
            >
                in {titleCase(thisMonth)}...
            </Header>
            <div
                id={`bloomingSliderContainer`}
                className={`relative overflow-x-scroll hide-scroll w-full bp-800:z-10 bp-800:max-w-sm bp-800:overflow-visible bp-800:justify-self-center bp-800:row-start-1 bp-800:col-start-3 bp-800:col-span-2 bp-800:-top-4 bp-800:right-0 bp-1000:max-w-md bp-1000:top-[-2.5rem]`}
            >
                <ul
                    id={`plantSlider`}
                    className={`flex flex-nowrap gap-4 z-20 overflow-y-visible bp-500:gap-8 bp-800:gap-2`}
                >
                    {plantList &&
                        plantList.map((plant, index) => (
                            <li
                                className={`plant flex flex-col justify-start items-center relative first-of-type:pl-4 last-of-type:pr-4`}
                                key={
                                    index + plant.plantName?.commonName?.trim()
                                }
                            >
                                <PlantName
                                    plantName={plant.plantName}
                                    className={`bp-800:hidden`}
                                ></PlantName>
                                <div onClick={(e) => changeCurrentPlant(index)}>
                                    <ResponsiveImage
                                        className={`featured-image w-full object-cover aspect-[8/6] h-auto max-bp-800:min-w-[85vw] bp-800:rounded-md bp-800:aspect-[3/4] bp-800:h-auto transition ease-in-out delay-150 b-800:hover:-translate-y-1 hover:scale-110`}
                                        wrapperClasses={`blooming-plant-img relative mb-5 bp-800:w-[5rem]`}
                                        slug={plant.slug.current}
                                        blurDataURL={
                                            plant.previewImage.asset.lqip
                                        }
                                        sizes="(max-width: 700px) 90vw, 700px"
                                        image={plant.previewImage}
                                        showCaption={false}
                                    />
                                </div>
                                <div className="px-2 flex flex-col bp-800:hidden">
                                    {plant.excerpt && (
                                        <p className={`mt-4`}>
                                            {plant.excerpt}
                                        </p>
                                    )}
                                    <Button
                                        linkDocType="nativePlant"
                                        internalLink={plant.slug?.current}
                                        className="btn-secondary mt-6 self-center"
                                    >
                                        Read more
                                    </Button>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
            <ResponsiveImage
                id={`featuredPlantImage`}
                wrapperClassName={`hidden bp-800:block bp-800:z-10 bp-800:mt-8 bp-800:row-start-2 bp-800:col-start-1 bp-800:col-span-2 bp-800:row-span-4 bp-1000:mt-0`}
                className={`w-[20rem] shadow-md object-cover aspect-[3/4] h-auto bp-900:w-[100%]`}
                slug={currentPlant.slug?.current}
                image={currentPlant.previewImage}
            />
            <div
                id={`featuredPlantBackground`}
                className={`hidden flex flex-col justify-between gap-5 px-4 bp-800:z-0 bp-800:row-start-2 bp-800:col-start-2 bp-800:col-span-3 bp-800:row-span-5 bp-800:pt-10 bp-800:flex bp-800:order-2 bp-800:rounded-md bp-800:bg-oe-green-yelow-600 bp-1000:ml-48 bp-1000:mt-10 bp-1000:row-start-1 bp-1000:col-start-1 bp-1000:row-span-4`}
            ></div>
            <PlantName
                className={`hidden max-w-2xl bp-800:block bp-800:z-10 bp-800:pl-6 bp-800:pr-12 bp-800:row-start-3 bp-800:col-start-3 bp-800:col-span-1 bp-800:row-span-1 bp-900:pl-8 bp-900:pr-14 bp-1000:m-0 bp-1400:pr-16`}
                plantName={currentPlant.plantName}
                bottomNameClassName={`bp-800:text-left`}
                topNameClassName={`bp-800:text-left`}
            ></PlantName>
            {currentPlant.excerpt && (
                <div
                    id="featuredPlantDesc"
                    className={`hidden max-w-2xl bp-800:block bp-800:z-10 bp-800:pl-6 bp-800:pr-12 bp-800:mb-8 bp-800:row-start-4 bp-800:col-start-3  bp-800:col-span-1 bp-800:row-span-1 bp-900:pl-8 bp-900:pr-14 bp-1400:pr-16`}
                >
                    {currentPlant.excerpt}
                </div>
            )}
            <Button
                linkDocType="nativePlant"
                internalLink={currentPlant.slug?.current}
                className={`hidden btn-secondary self-center mt-6 bp-800:block bp-800:z-10 bp-800:mb-8 bp-800:mt-0 bp-800:justify-self-center bp-800:row-start-5 bp-800:col-start-2 bp-800:col-span-4 bp-800:row-span-1 bp-900:mb-14 bp-900:col-end-5 bp-1000:row-start-4 bp-1000:self-end`}
            >
                See more
            </Button>
        </section>
    );
};

BloomingNow.propTypes = {};

export default BloomingNow;
