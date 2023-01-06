import React, { useState } from 'react';
import SeasonsPreview from './SeasonsPreview';
import PropTypes from 'prop-types';
import PlantName from './PlantName';
import ResponsiveImage from './ResponsiveImage';
import { getCurrentMonthName } from '@lib/utilities/helperUtil';
import CircleHeader from './CircleHeader';
import Button from './Button';
import PortTextWrapper  from './PortableText';

import cx from 'classnames';

const BloomingNow = (props) => {
    const { plantList, seasonData } = props;
    // const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
    // const [currentPlant, setCurrentPlant] = useState(
    //     plantList[currentPlantIndex]
    // );
    const thisMonth = getCurrentMonthName();

    // const showNextPlant = () => {
    //     let newIndex =
    //         currentPlantIndex === plantList.length - 1
    //             ? 0
    //             : currentPlantIndex + 1;
    //     setCurrentPlantIndex(newIndex);
    //     setCurrentPlant(plantList[newIndex]);
    // };
    // const showPreviousPlant = () => {
    //     let newIndex =
    //         currentPlantIndex === 0
    //             ? plantList.length - 1
    //             : currentPlantIndex - 1;
    //     setCurrentPlantIndex(newIndex);
    //     setCurrentPlant(plantList[newIndex]);
    // };

    // const BloomingNav = (props) => (
    //     <nav className="blooming-nav" aria-labelledby="bloomingHeader">
    //         <Button
    //             classes={['btn-arrow-prev']}
    //             callBack={showPreviousPlant}
    //         ></Button>
    //         <h2 id={"bloomingHeader"} className={`blooming-header`}>
    //             Blooming in {thisMonth}
    //         </h2>
    //         <Button classes={['play-button']} callBack={}></Button>
    //         <Button
    //             classes={['btn-arrow-next']}
    //             callBack={showNextPlant}
    //         ></Button>
    //     </nav>
    // );
    console.log('plants blooming now ', plantList);

    return (
        <div id="bloomingNow" className="blooming">
            <section id="seasonsPreview" className={`seasons`}>
                {seasonData.length && (
                    <SeasonsPreview seasonData={seasonData[0]}></SeasonsPreview>
                )}
            </section>
            <section id="bloomingThisMonth" className={`blooming-now`}>
                <CircleHeader
                    id={`bloomingHeader`}
                    wrapperClasses={`blooming-header`}
                    headerClasses={`blooming-header-title swatch-2`}
                    accentColor="#9d3c10"
                    firstLetter
                    // showCircle
                >
                    Blooming in {thisMonth}
                </CircleHeader>
                {/* <div id={'bloomingHeader'} className={`blooming-header`}>
                    <h2 className={`blooming-header-title`}>
                        Blooming in {thisMonth}
                    </h2>
                </div> */}
                {/*<PlantName plant={currentPlant}></PlantName>
                <ResponsiveImage
                    classNames={['thumbnail', 'featured-image']}
                    slug={plant.slug.current}
                    // width={'300px'}
                    image={plant.previewImage.asset}
                    key={'index'}
                /> */}
                <div className={`plant-container`}>
                    <div className={`plant-slider`}>
                        {plantList &&
                            plantList.map((plant, index) => (
                                <div className={'plant'} key={index}>
                                    <PlantName
                                        plantName={plant.plantName}
                                    ></PlantName>
                                    <ResponsiveImage
                                        classes={['featured-image']}
                                        wrapperClasses={'blooming-plant-img'}
                                        slug={plant.slug.current}
                                        placeholder="empty"
                                        blurDataURL={
                                            plant.previewImage.asset.lqip
                                        }
                                        // style={{
                                        //     width: '100%',
                                        //     height: '100%',
                                        // }}
                                        sizes="(max-width: 700px) 90vw, 700px"
                                        image={plant.previewImage.asset}
                                        alt={plant.previewImage.alt}
                                        // caption={plant.previewImage.caption}
                                        // fill="false"
                                        // width={'500'}
                                        // height={'800'}
                                        // mobileWIdth={'300'}
                                    />
                                    {plant.description && (
                                        <PortTextWrapper
                                            value={plant.description}
                                            components={{}}
                                        />
                                    )}
                                    <Button
                                        linkDocType="nativePlant"
                                        internalLink={plant.slug.current}
                                        className="btn-secondary"
                                    >
                                        Read more
                                    </Button>
                                </div>
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

BloomingNow.propTypes = {};

export default BloomingNow;
