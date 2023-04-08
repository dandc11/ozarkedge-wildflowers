import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { sanityClient } from '@lib/sanity.server';
import {
    GET_ALL_NATIVE_PLANT_PATHS_QUERY,
    GET_PLANT_PAGE_DATA,
} from '@lib/queries';
import { getInternalLinkFullPath } from '@lib/utilities/helperUtil';
import { PLANT_PAGE_SECTIONS } from '@lib/utilities/constants';
import Link from 'next/link';
import PlantName from 'components/PlantName';
import Header from 'components/Header';
import ResponsiveImage from 'components/ResponsiveImage';
import PortTextWrapper from 'components/PortableText';
import TableOfContents from 'components/TableOfContents';
import cx from 'classnames';
import Button from 'components/Button';

const IntroSection = ({
    previewImage,
    plantName,
    lede,
    tocLinks,
    openToCSection,
    setShowToC,
    bannerImage,
    // setOpenToCSection,
}) => {
    return (
        <div>
            {(previewImage || bannerImage) && (
                <ResponsiveImage
                    className={`relative w-full bp-1200:object-cover bp-1200:object-center bp-1200:h-full`}
                    figureClassName={`w-full rounded-none bp-1200:h-[80vh]`}
                    height={`auto`}
                    width={`auto`}
                    image={bannerImage}
                    mobileImage={previewImage}
                    breakpoint={'500'}
                    mobileWidth
                    priority={true}
                    placeholder={``}
                    quality={`100`}
                    showCaption={false}
                    wrapperClassName={`w-full`}
                />
            )}
            <div
                className={`relative bg-white -mt-[3.2rem] w-11/12 m-auto bp-900:w-fit bp-900:ml-8 z-10 bp-900:flex bp-900:pb-3`}
            >
                <div className={`bp-900:max-w-lg`}>
                    {plantName && (
                        <div
                            id={`header`}
                            className={`relative block px-6 py-3 bp-400:px-10 bp-900:px-6`}
                        >
                            <PlantName
                                className={`bp-900:text-left`}
                                bottomNameClassName={`bp-900:text-left`}
                                plantName={plantName}
                            ></PlantName>
                        </div>
                    )}
                    {lede && (
                        <div id="lede">
                            <PortTextWrapper
                                className={`plant-pg-port-text px-6 max-bp-900:`}
                                value={lede}
                            ></PortTextWrapper>
                            <br></br>
                        </div>
                    )}
                </div>
                <div className={`bp-900:pt-6`}>
                    <TableOfContents
                        showHeader
                        showCircle
                        headerClassName={`mb-3`}
                        listItemClassName={``}
                        className={cx({
                            'max-[900px]:hidden': openToCSection !== 'intro',
                        })}
                        callBack={() => setShowToC('intro')}
                        links={tocLinks}
                    />
                    <Button
                        className={`bg-transparent w-full bp-900:hidden`}
                        callBack={() => setShowToC('intro')}
                        buttonIcon="expand"
                        expanded={openToCSection === 'intro'}
                    ></Button>
                </div>
            </div>
        </div>
    );
};

const ImageGallery = ({
    images,
    tocLinks,
    openToCSection,
    setOpenToCSection,
}) => {
    const setShowToC = () => {
        openToCSection === 'name'
            ? setOpenToCSection('none')
            : setOpenToCSection('name');
    };
    return (
        <>
            {' '}
            {images && (
                <div className={`relative z-0`}>
                    <Header
                        id={'images'}
                        wrapperClassName
                        showCircle
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.images}
                    ></Header>
                </div>
            )}
        </>
    );
};

const NameInfo = ({ plantName, tocLinks, openToCSection, setShowToC }) => {
    return (
        <>
            {plantName.nameInformation && (
                <section
                    className={cx('relative mt-10', {
                        'z-10':
                            openToCSection === PLANT_PAGE_SECTIONS.plantName,
                        'z-0': openToCSection !== PLANT_PAGE_SECTIONS.plantName,
                    })}
                >
                    <Header
                        id={'plantName'}
                        wrapperClassName={``}
                        showCircle
                        setShowToC={setShowToC}
                        showToC={
                            openToCSection === PLANT_PAGE_SECTIONS.plantName
                        }
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.plantName}
                    ></Header>
                    <div>
                        <PortTextWrapper
                            className={`plant-pg-port-text`}
                            value={plantName.nameInformation}
                        ></PortTextWrapper>
                        <br></br>
                    </div>
                </section>
            )}
        </>
    );
};

const BloomInfo = ({ bloomText, tocLinks, openToCSection, setShowToC }) => {
    return (
        <>
            {' '}
            {bloomText && (
                <section
                    className={cx('relative', {
                        'z-10':
                            openToCSection === PLANT_PAGE_SECTIONS.bloomText,
                        'z-0': openToCSection !== PLANT_PAGE_SECTIONS.bloomText,
                    })}
                >
                    <Header
                        id={'bloom'}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={
                            openToCSection === PLANT_PAGE_SECTIONS.bloomText
                        }
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.bloomText}
                    ></Header>
                    <div>
                        <PortTextWrapper
                            className={`plant-pg-port-text`}
                            value={bloomText}
                        ></PortTextWrapper>
                    </div>
                </section>
            )}
        </>
    );
};

const Description = ({ description, tocLinks, openToCSection, setShowToC }) => {
    return (
        <>
            {description && (
                <section
                    className={cx('relative', {
                        'z-10':
                            openToCSection === PLANT_PAGE_SECTIONS.description,
                        'z-0':
                            openToCSection !== PLANT_PAGE_SECTIONS.description,
                    })}
                >
                    <Header
                        id={'description'}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={
                            openToCSection === PLANT_PAGE_SECTIONS.description
                        }
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.description}
                    ></Header>
                    <div>
                        <PortTextWrapper
                            className={`plant-pg-port-text`}
                            value={description}
                        ></PortTextWrapper>
                    </div>
                    <br></br>
                </section>
            )}
        </>
    );
};

const GrowingNearby = ({
    growingNearbyPlantList,
    growingNearbyText,
    tocLinks,
    openToCSection,
    setShowToC,
}) => {
    return (
        <>
            {growingNearbyText && (
                <section
                    id="growingNearby"
                    className={cx(
                        'relative bg-oe-green-yelow-400 px-5 bp-400:px-8 bp-700:px-12 bp-1000:px-36',
                        {
                            'z-10':
                                openToCSection ===
                                PLANT_PAGE_SECTIONS.growingNearbyText,
                            'z-0':
                                openToCSection !==
                                PLANT_PAGE_SECTIONS.growingNearbyText,
                        }
                    )}
                >
                    <Header
                        id={'growingNearbyText'}
                        wrapperClasses={``}
                        showCircle
                        setShowToC={setShowToC}
                        showToC={
                            openToCSection ===
                            PLANT_PAGE_SECTIONS.growingNearbyText
                        }
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.growingNearbyText}
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
                                            className={`relative flex flex-col h-full`}
                                        >
                                            <div>
                                                <Link
                                                    href={`${getInternalLinkFullPath(
                                                        nearbyPlant.docType,
                                                        nearbyPlant.slug
                                                    )}`}
                                                >
                                                    <ResponsiveImage
                                                        className={`w-full aspect-[3/4] h-auto`}
                                                        captionClassName={`absolute`}
                                                        figureClassName={`img w-64 relative mb-5 rounded-md bp-800:w-[15rem] bp-800:aspect-[3/4] bp-800:h-auto transition ease-in-out delay-150 b-800:hover:-translate-y-1 hover:scale-110`}
                                                        wrapperClassName={``}
                                                        height
                                                        image={
                                                            nearbyPlant.previewImage
                                                        }
                                                        sizes="(max-width: 100px) 90vw, 700px"
                                                        mobileWidth
                                                        priority={false}
                                                        placeholder={``}
                                                        // quality={`100`}
                                                        showCaption={true}
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
                </section>
            )}
        </>
    );
};

const Habitat = ({ habitat, tocLinks, openToCSection, setShowToC }) => {
    return (
        <>
            {habitat && (
                <section
                    className={cx('relative mt-11', {
                        'z-10': openToCSection === PLANT_PAGE_SECTIONS.habitat,
                        'z-0': openToCSection !== PLANT_PAGE_SECTIONS.habitat,
                    })}
                >
                    <Header
                        id={'habitat'}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={openToCSection === PLANT_PAGE_SECTIONS.habitat}
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.habitat}
                    ></Header>
                    <div>
                        <PortTextWrapper
                            className={`plant-pg-port-text`}
                            value={habitat}
                        ></PortTextWrapper>
                        <br></br>
                    </div>
                </section>
            )}
        </>
    );
};

const ConservationStatus = ({
    conservationStatus,
    tocLinks,
    openToCSection,
    setShowToC,
}) => {
    return (
        <>
            {conservationStatus && (
                <section
                    className={cx('relative', {
                        'z-10':
                            openToCSection ===
                            PLANT_PAGE_SECTIONS.conservationStatus,
                        'z-0':
                            openToCSection !==
                            PLANT_PAGE_SECTIONS.conservationStatus,
                    })}
                >
                    <Header
                        id={'conservationStatus'}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={
                            openToCSection ===
                            PLANT_PAGE_SECTIONS.conservationStatus
                        }
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.conservationStatus}
                    ></Header>
                    <div>
                        <PortTextWrapper
                            className={`plant-pg-port-text`}
                            value={conservationStatus}
                        ></PortTextWrapper>
                    </div>
                </section>
            )}
        </>
    );
};

const Tidbits = ({ tidbits, tocLinks, openToCSection, setShowToC }) => {
    return (
        <>
            {tidbits && (
                <section
                    className={cx('relative', {
                        'z-10': openToCSection === PLANT_PAGE_SECTIONS.tidbits,
                        'z-0': openToCSection !== PLANT_PAGE_SECTIONS.tidbits,
                    })}
                >
                    <Header
                        id={'tidbits'}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={openToCSection === PLANT_PAGE_SECTIONS.tidbits}
                        tocLinks={tocLinks}
                        spanText={PLANT_PAGE_SECTIONS.tidbits}
                    ></Header>
                    <div>
                        <PortTextWrapper
                            className={`plant-pg-port-text`}
                            value={tidbits}
                        ></PortTextWrapper>
                    </div>
                    <br></br>
                </section>
            )}
        </>
    );
};

// get links to section ids for the sections with content
const getSectionLinks = (pageData) => {
    let tableOfContents = {};
    for (const section in PLANT_PAGE_SECTIONS) {
        if (pageData[section] && pageData[section] !== null) {
            tableOfContents[section] = PLANT_PAGE_SECTIONS[section];
        }
    }
    return tableOfContents;
};

const NativePlantPage = ({ pageData }) => {
    const {
        bannerImage,
        bloomText,
        conservationStatus,
        description,
        flowerColor,
        floweringMonths,
        floweringSeason,
        growingNearbyText,
        growingNearbyPlantList,
        habitat,
        images,
        lede,
        plantName,
        previewImage,
        tidbits,
    } = { ...pageData };
    const sectionLinks = getSectionLinks(pageData);
    const [openToCSection, setOpenToCSection] = useState('none');
    const setShowToC = (section) => {
        openToCSection === section
            ? setOpenToCSection('none')
            : setOpenToCSection(section);
    };
    console.log('plant page data ', pageData);

    return (
        <div className="bg-topography pb-10">
            {pageData && (
                <>
                    <header className="">
                        <IntroSection
                            previewImage={previewImage}
                            bannerImage={bannerImage}
                            lede={lede}
                            plantName={plantName}
                            tocLinks={sectionLinks}
                            openToCSection={openToCSection}
                            setShowToC={setShowToC}
                            // setOpenToCSection={setOpenToCSection}
                        />
                    </header>
                    <main id="plantPageMainContent">
                        <div
                            className={`z-0 px-5 bp-400:px-8 bp-700:px-12 bp-1000:px-36 [&_section]:ml-auto [&_section]:mr-auto [&_section]:max-w-7xl [&_section]:pb-12 [&_section]:pt-2`}
                        >
                            <NameInfo
                                plantName={plantName}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                            />
                            <BloomInfo
                                bloomText={bloomText}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                            />
                            <Description
                                description={description}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                            />
                        </div>
                        <GrowingNearby
                            growingNearbyPlantList={growingNearbyPlantList}
                            growingNearbyText={growingNearbyText}
                            tocLinks={sectionLinks}
                            openToCSection={openToCSection}
                            setShowToC={setShowToC}
                        />
                        <div
                            className={`z-0 px-5 bp-400:px-8 bp-700:px-12 bp-1000:px-36 [&_section]:ml-auto [&_section]:mr-auto [&_section]:max-w-7xl [&_section]:pb-12 [&_section]:pt-2`}
                        >
                            <Habitat
                                habitat={habitat}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                            />
                            <ConservationStatus
                                conservationStatus={conservationStatus}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                            />
                            <Tidbits
                                tidbits={tidbits}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                            />
                        </div>
                    </main>
                </>
            )}
        </div>
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
