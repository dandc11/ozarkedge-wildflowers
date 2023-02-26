import React from 'react';
import PropTypes from 'prop-types';
import { sanityClient } from '@lib/sanity.server';
import {
    GET_ALL_NATIVE_PLANT_PATHS_QUERY,
    GET_PLANT_PAGE_DATA,
} from '@lib/queries';
import { MONTH_NAMES } from '@lib/utilities/constants';
import { titleCase, getInternalLinkFullPath } from '@lib/utilities/helperUtil';
import Link from 'next/link';
import PlantName from 'components/PlantName';
import Header from 'components/Header';
import ResponsiveImage from 'components/ResponsiveImage';
import PortTextWrapper from 'components/PortableText';
import cx from 'classnames';

const NativePlantPage = ({ pageData }) => {
    const {
        conservationStatus,
        description,
        flowerColor,
        floweringMonths,
        floweringSeason,
        growingNearbyText,
        growingNearbyPlantList,
        habitat,
        images,
        plantName,
        previewImage,
        tidbits,
    } = { ...pageData };
    console.log('plant page data ', pageData);
    return (
        <>
            {pageData && (
                <div className={`z-0 bg-oe-green-yelow-200`}>
                    {previewImage && (
                        <ResponsiveImage
                            className={`w-full`}
                            figureClassName={`w-full`}
                            height
                            image={pageData.previewImage}
                            mobileWidth
                            priority={false}
                            placeholder={``}
                            quality={`100`}
                            showCaption={false}
                            wrapperClassName={`w-full`}
                        />
                    )}
                    {plantName && (
                        <>
                            <div
                                id={`name`}
                                className={`max-w-[90%] relative z-10 m-auto -mt-12 px-4 bg-white`}
                            >
                                <PlantName
                                    align={`right`}
                                    plantName={pageData.plantName}
                                ></PlantName>
                            </div>
                            <div>
                                <PortTextWrapper
                                    className={`plant-pg-port-text`}
                                    value={pageData.plantName.nameInformation}
                                ></PortTextWrapper>
                                <br></br>
                            </div>
                        </>
                    )}
                    {description && (
                        <div id="descriptionSection" className={`pb-10`}>
                            <Header
                                id={`description`}
                                wrapperClassName
                                showCircle
                                spanText={'DESCRIPTION'}
                            ></Header>
                            <div>
                                <PortTextWrapper
                                    className={`plant-pg-port-text`}
                                    value={description}
                                ></PortTextWrapper>
                            </div>
                            <br></br>
                        </div>
                    )}
                    {growingNearbyText && (
                        <div
                            id="nearbySection"
                            className={`pb-10 relative bg-oe-green-yelow-400`}
                        >
                            <Header
                                id={`nearby`}
                                wrapperClassName={``}
                                showCircle
                                spanText={'PLANTS GROWING NEARBY'}
                            ></Header>
                            <div
                                className={`relative overflow-x-scroll w-full pt-2 hide-scroll`}
                            >
                                <ul className={`flex flex-nowrap gap-3 h-full`}>
                                    {growingNearbyPlantList &&
                                        growingNearbyPlantList.map(
                                            (nearbyPlant, index) => (
                                                <li
                                                    key={index}
                                                    className={`relative flex flex-col h-full first-of-type:pl-6 last-of-type:pr-4`}
                                                >
                                                    <div>
                                                        <Link
                                                            href={`${getInternalLinkFullPath(
                                                                nearbyPlant.docType,
                                                                nearbyPlant.slug
                                                            )}`}
                                                        >
                                                            <ResponsiveImage
                                                                className={`w-full  object-cover aspect-[3/4] h-auto`}
                                                                figureClassName={`img w-64 relative mb-5 rounded-md bp-800:w-[15rem] bp-800:aspect-[3/4] bp-800:h-auto transition ease-in-out delay-150 b-800:hover:-translate-y-1 hover:scale-110`}
                                                                height
                                                                image={
                                                                    nearbyPlant.previewImage
                                                                }
                                                                sizes="(max-width: 100px) 90vw, 700px"
                                                                mobileWidth
                                                                priority={false}
                                                                placeholder={``}
                                                                // quality={`100`}
                                                                showCaption={
                                                                    true
                                                                }
                                                                wrapperClassName={``}
                                                            />
                                                        </Link>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                </ul>
                            </div>
                            <div>
                                <PortTextWrapper
                                    className={`plant-pg-port-text`}
                                    value={growingNearbyText}
                                ></PortTextWrapper>
                                <br></br>
                            </div>
                        </div>
                    )}
                    {habitat && (
                        <div id="habitatSection" className={`pb-10`}>
                            <Header
                                id={`habitat`}
                                wrapperClassName
                                showCircle
                                spanText={'HABITAT'}
                            ></Header>
                            <div>
                                <PortTextWrapper
                                    className={`plant-pg-port-text`}
                                    value={habitat}
                                ></PortTextWrapper>
                                <br></br>
                            </div>
                        </div>
                    )}
                    {conservationStatus && (
                        <div id="conservationSection" className={`pb-10`}>
                            <Header
                                id={`conservation`}
                                wrapperClassName
                                showCircle
                                spanText={'CONSERVATION STATUS'}
                            ></Header>
                            <div>
                                <PortTextWrapper
                                    className={`plant-pg-port-text`}
                                    value={conservationStatus}
                                ></PortTextWrapper>
                            </div>
                        </div>
                    )}
                    {tidbits && (
                        <div
                            id="tidbitsSection"
                            className={`pb-10 bg-oe-green-yelow-400`}
                        >
                            <Header
                                id={`tidbits`}
                                wrapperClassName
                                showCircle
                                spanText={'INTERESTING TIDBITS'}
                            ></Header>
                            <div>
                                <PortTextWrapper
                                    className={`plant-pg-port-text`}
                                    value={tidbits}
                                ></PortTextWrapper>
                            </div>
                            <br></br>
                        </div>
                    )}{' '}
                </div>
            )}
        </>
    );
};

export async function getStaticPaths() {
    const plantPagePaths = await sanityClient.fetch(
        GET_ALL_NATIVE_PLANT_PATHS_QUERY
    );
    const paths = plantPagePaths.map((slug) => ({
        params: { slug },
    }));
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps(context) {
    const { slug = '' } = context.params;
    const pageData = await sanityClient.fetch(GET_PLANT_PAGE_DATA, { slug });
    return {
        props: {
            pageData,
        },
    };
}

NativePlantPage.propTypes = {};

export default NativePlantPage;
