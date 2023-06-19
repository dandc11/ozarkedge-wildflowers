import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { sanityClient } from '@lib/sanity.server';
import {
    GET_ALL_NATIVE_PLANT_PATHS_QUERY,
    GET_PLANT_PAGE_DATA,
} from '@lib/queries';

import { PLANT_PAGE_SECTIONS } from '@lib/utilities/constants';
import PlantName from 'components/PlantName';
import Header from 'components/Header';
import ResponsiveImage from 'components/ResponsiveImage';
import PortTextWrapper from 'components/PortableText';
import TableOfContents from 'components/TableOfContents';
import cx from 'classnames';
import Button from 'components/Button';
import Lightbox from 'components/Lightbox';
import ThumbnailGrid from 'components/ThumbnailGrid';
import ImageSlider from 'components/ImageSlider';

/**
 * IntroSection component - 1st section of plant page (intro text)
 * @param {lede} lede - lede text
 * @param {openToCSection} openToCSection - currently open table of contents section
 * @param {plantName} plantName - plant name object
 * @param {setShowToC} setShowToC - function to set currently open table of contents section
 * @param {tocLinks} tocLinks - table of contents links
 * @returns {JSX.Element} - IntroSection component JSX
 * @example
 *  <IntroSection
 *    lede={lede}
 *    openToCSection={openToCSection}
 *    plantName={plantName}
 *    setShowToC={setShowToC}
 *    tocLinks={tocLinks}
 *  />
 */
const IntroSection = ({
    lede,
    openToCSection,
    plantName,
    setShowToC,
    tocLinks,
}) => {
    return (
        <div
            className={`relative bg-white max-w-lg w-11/12 bp-700:max-w-full bp-700:flex bp-700:py-3 bp-900:w-fit bp-900:ml-3 z-10 bp-1200:px-5 bp-1200:py-3  bp-1600:py-6`}
        >
            <div className={`px-6 bp-500:px-8 bp-900:w-[30rem] bp-900:mr-4`}>
                {plantName && (
                    <div id={`header`} className={`relative block py-3`}>
                        <PlantName
                            topNameClassName={`bp-700:text-left bp-1200:text-3xl`}
                            bottomNameClassName={`bp-700:text-left`}
                            plantName={plantName}
                        ></PlantName>
                    </div>
                )}
                {lede && (
                    <div id="lede">
                        <PortTextWrapper
                            className={`plant-pg-port-text`}
                            value={lede}
                        ></PortTextWrapper>
                        <br></br>
                    </div>
                )}
            </div>
            <div className={`pt-6 `}>
                <TableOfContents
                    showHeader
                    showCircle
                    shadow={false}
                    headerClassName={`mb-3`}
                    listItemClassName={`mx-4 whitespace-nowrap`}
                    className={cx({
                        'max-[700px]:hidden': openToCSection !== 'intro',
                    })}
                    toggleLightboxCallback={() => setShowToC('intro')}
                    links={tocLinks}
                />
                <Button
                    className={`bg-transparent w-full self-center bp-700:hidden`}
                    callBack={() => setShowToC('intro')}
                    buttonIcon="expand"
                    expanded={openToCSection === 'intro'}
                ></Button>
            </div>
        </div>
    );
};

/**
 * NameInfo component - 2nd section of plant page (name info text)
 * @param {plantName} plantName - plant name object
 * @param {tocLinks} tocLinks - table of contents links
 * @param {openToCSection} openToCSection - currently open table of contents section
 * @param {setShowToC} setShowToC - function to set currently open table of contents section
 * @param {toggleLightboxCallback} toggleLightboxCallback - function to toggle lightbox
 * @returns {JSX.Element} - JSX Element for name info section
 * @example
 * <NameInfo
 *   plantName={plantName}
 *   tocLinks={tocLinks}
 *   openToCSection={openToCSection}
 *   setShowToC={setShowToC}
 *   toggleLightboxCallback={toggleLightboxCallback}
 * ></NameInfo>
 */
const NameInfo = ({
    plantName,
    tocLinks,
    openToCSection,
    setShowToC,
    toggleLightboxCallback,
}) => {
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
                    >
                        <span>{PLANT_PAGE_SECTIONS.plantName}</span>
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
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

/**
 * BloomInfo component - 3rd section of plant page (bloom text)
 * @param {string} bloomText - text about plant bloom
 * @param {array} tocLinks - array of objects with shape {id: string, text: string} for table of contents links
 * @param {string} openToCSection - id of section that is open in table of contents
 * @param {function} setShowToC - function to set which section is open in table of contents
 * @param {function} toggleLightboxCallback - function to toggle lightbox
 * @returns {JSX.Element} - JSX Element for bloom info section
 * @example
 *  <BloomInfo
 *     bloomText={bloomText}
 *     tocLinks={tocLinks}
 *     openToCSection={openToCSection}
 *     setShowToC={setShowToC}
 *     toggleLightboxCallback={toggleLightboxCallback}
 *   ></BloomInfo>
 */
const BloomInfo = ({
    bloomText,
    tocLinks,
    openToCSection,
    setShowToC,
    toggleLightboxCallback,
}) => {
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
                        id={'bloomText'}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={
                            openToCSection === PLANT_PAGE_SECTIONS.bloomText
                        }
                        tocLinks={tocLinks}
                    >
                        <span>{PLANT_PAGE_SECTIONS.bloomText}</span>
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
                            className={`plant-pg-port-text`}
                            value={bloomText}
                        ></PortTextWrapper>
                    </div>
                </section>
            )}
        </>
    );
};

/**
 * Pollinators component - 4th section of plant page (pollinators)
 * @param {array} pollinators - array of pollinator objects (see schema.js for object shape)
 * @param {array} tocLinks - array of objects with shape {id: string, text: string} for table of contents links
 * @param {string} openToCSection - id of section that is open in table of contents
 * @param {function} setShowToC - function to set which section is open in table of contents
 * @returns {JSX.Element} - JSX element with pollinator information
 * @example
 * <Pollinators
 *   pollinators={pollinators}
 *   tocLinks={tocLinks}
 *   openToCSection={openToCSection}
 *   setShowToC={setShowToC}
 * ></Pollinators>
 */
const Pollinators = ({ pollinators, tocLinks, openToCSection, setShowToC }) => {
    return (
        <>
            {' '}
            {pollinators && (
                <section
                    className={cx('relative', {
                        'z-10':
                            openToCSection === PLANT_PAGE_SECTIONS.pollinators,
                        'z-0':
                            openToCSection !== PLANT_PAGE_SECTIONS.pollinators,
                    })}
                >
                    <Header
                        id={'pollinators'}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={
                            openToCSection === PLANT_PAGE_SECTIONS.pollinators
                        }
                        tocLinks={tocLinks}
                    >
                        <span>{PLANT_PAGE_SECTIONS.pollinators}</span>
                    </Header>
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

/**
 * Description component - 1st section of plant page (description)
 * @param {string} description - description of plant
 * @param {array} tocLinks - array of objects with link and text for table of contents
 * @param {string} openToCSection - section of table of contents that is open
 * @param {function} setShowToC - function to set section of table of contents that is open
 * @param {function} toggleLightboxCallback - function to toggle lightbox
 * @returns {JSX} - returns jsx of description section
 */
const Description = ({
    description,
    tocLinks,
    openToCSection,
    setShowToC,
    toggleLightboxCallback,
}) => {
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
                    >
                        <span>{PLANT_PAGE_SECTIONS.description}</span>
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
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

/**
 * GrowingNearby component - 6th section of plant page (growing nearby)
 * @param {Array} growingNearbyPlantList - list of plants that grow nearby
 * @param {String} growingNearbyText - text about growing nearby
 * @param {Array} tocLinks - list of links for the table of contents
 * @param {String} openToCSection - section of the table of contents that is open
 * @param {Function} setShowToC - function to set the table of contents
 * @param {Function} toggleLightboxCallback - function to toggle the lightbox
 * @returns {JSX.Element} - returns jsx of growing nearby section
 */
const GrowingNearby = ({
    growingNearbyPlantList,
    growingNearbyText,
    tocLinks,
    openToCSection,
    setShowToC,
    toggleLightboxCallback,
}) => {
    const plantImages = growingNearbyPlantList?.map((plant) => {
        return {
            image: plant.previewImage,
            slug: plant.slug,
            docType: plant.docType,
        };
    });

    return (
        <>
            {growingNearbyText && (
                <section
                    id="growingNearbyText"
                    className={cx(
                        'relative bg-oe-green-yelow-400 px-5 bp-400:px-8 bp-700:px-12 bp-1000:px-36 ',
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
                    <div className="max-w-7xl m-auto">
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
                        >
                            <span>{PLANT_PAGE_SECTIONS.growingNearbyText}</span>
                        </Header>
                        <ImageSlider sliderItems={plantImages} useLinks captionBgClass={'bg-oe-green-yellow-200'} />
                        <div>
                            <PortTextWrapper
                                lightboxCallback={toggleLightboxCallback}
                                className={`plant-pg-port-text`}
                                value={growingNearbyText}
                            ></PortTextWrapper>
                            <br></br>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

// Habitat component - 7th section of plant page (habitat)
const Habitat = ({
    habitat,
    tocLinks,
    openToCSection,
    setShowToC,
    lightboxIdentifier,
    toggleLightboxCallback,
}) => {
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
                    >
                        <span>{PLANT_PAGE_SECTIONS.habitat}</span>
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
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

// ConservationStatus component - 8th section of plant page (conservation status)
const ConservationStatus = ({
    conservationStatus,
    tocLinks,
    openToCSection,
    setShowToC,
    lightboxIdentifier,
    toggleLightboxCallback,
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
                    >
                        <span>{PLANT_PAGE_SECTIONS.conservationStatus}</span>
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
                            className={`plant-pg-port-text`}
                            value={conservationStatus}
                        ></PortTextWrapper>
                    </div>
                </section>
            )}
        </>
    );
};

// Tidbits component - 9th section of plant page (tidbits)
const Tidbits = ({
    tidbits,
    tocLinks,
    openToCSection,
    setShowToC,
    lightboxIdentifier,
    toggleLightboxCallback,
}) => {
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
                    >
                        <span>{PLANT_PAGE_SECTIONS.tidbits}</span>
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
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
        if (pageData[section] !== undefined && pageData[section] !== null) {
            tableOfContents[section] = PLANT_PAGE_SECTIONS[section];
        }
    }
    return tableOfContents;
};

/**
 * Plant page component - renders all sections of the plant page
 * @param {object} pageData - data for the plant page
 * @returns {JSX.Element} - plant page component
 *
 */
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
        pollinators,
        previewImage,
        tidbits,
    } = { ...pageData };
    const sectionLinks = getSectionLinks(pageData);
    const [openToCSection, setOpenToCSection] = useState('none');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const setShowToC = (section) => {
        openToCSection === section
            ? setOpenToCSection('none')
            : setOpenToCSection(section);
    };

    /**
     * function to toggle lightbox open/close
     */
    const toggleLightbox = () => {
        setIsLightboxOpen(!isLightboxOpen);
    };
    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };
    return (
        <div className="bg-topography pb-10">
            {pageData && (
                <>
                    {(previewImage || bannerImage) && (
                        <div id="bannerImage" className="relative">
                            <ResponsiveImage
                                className={`relative w-full bp-1200:object-cover bp-1200:object-center bp-1200:h-full`}
                                figureClassName={`w-full rounded-none bp-1600:h-[80vh]`}
                                // height={`auto`}
                                // width={`auto`}
                                image={bannerImage}
                                mobileImage={previewImage}
                                breakpoint={'500'}
                                priority={true}
                                placeholder={``}
                                quality={`100`}
                                showCaption={false}
                                sizes={`100vw`}
                                wrapperClassName={`w-full`}
                            />
                        </div>
                    )}
                    <header className="flex flex-col justify-center items-center -mt-12 bp-700:-mt-24 bp-900:justify-around bp-1200:gap-4 bp-1200:flex-row bp-1200:max-w-fit bp-1200:ml-auto bp-1200:mr-auto bp-1200:pt-8">
                        <IntroSection
                            bannerImage={bannerImage}
                            lede={lede}
                            plantName={plantName}
                            tocLinks={sectionLinks}
                            lightboxImgClass={`w-12`}
                            openToCSection={openToCSection}
                            setShowToC={setShowToC}
                        />
                        <div className="max-w-md bp-1200:self-end bp-1200:pt-4 bp-1400:ml-4 bp-1600:ml-14">
                            {images && (
                                <div
                                    id={`images`}
                                    className="flex flex-col items-center"
                                >
                                    <ThumbnailGrid
                                        className={`relative z-0 flex flex-col gap-4 mt-8 px-4`}
                                        assets={images}
                                        cols={3}
                                        thumbnailWidth={100}
                                        maxItems={6}
                                        lightboxIdentifier={`plantPage`}
                                    />
                                    <Button
                                        className={`btn-secondary w-10 mt-6 mb-10 bp-1200:mb-0`}
                                        callBack={() => toggleLightbox()}
                                    >
                                        View All Images
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>
                    <main id="plantPageMainContent w-full">
                        <div
                            className={`z-0 m-auto w-[90%] bp-400:w-[87%] bp-700:w-[75%] bp-1000:px-36 [&_section]:ml-auto [&_section]:mr-auto [&_section]:max-w-7xl [&_section]:pb-12 [&_section]:pt-2`}
                        >
                            <NameInfo
                                plantName={plantName}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                                lightboxIdentifier={`plantPage`}
                                toggleLightboxCallback={() =>
                                    toggleLightbox()
                                }
                            />
                            <BloomInfo
                                bloomText={bloomText}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                                lightboxIdentifier={`plantPage`}
                                toggleLightboxCallback={() =>
                                    toggleLightbox()
                                }
                            />
                            <Description
                                description={description}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                                lightboxIdentifier={`plantPage`}
                                toggleLightboxCallback={() =>
                                    toggleLightbox()
                                }
                            />
                            <Pollinators
                                pollinators={pollinators}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                                lightboxIdentifier={`plantPage`}
                                toggleLightboxCallback={() =>
                                    toggleLightbox()
                                }
                            />
                        </div>
                        <GrowingNearby
                            growingNearbyPlantList={growingNearbyPlantList}
                            growingNearbyText={growingNearbyText}
                            tocLinks={sectionLinks}
                            openToCSection={openToCSection}
                            setShowToC={setShowToC}
                            toggleLightboxCallback={() => toggleLightbox()}
                        />
                        <div
                            className={`z-0 px-5 bp-400:px-8 bp-700:px-12 bp-1000:px-36 [&_section]:ml-auto [&_section]:mr-auto [&_section]:max-w-7xl [&_section]:pb-12 [&_section]:pt-2`}
                        >
                            <Habitat
                                habitat={habitat}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                                lightboxIdentifier={`plantPage`}
                                toggleLightboxCallback={() =>
                                    toggleLightbox()
                                }
                            />
                            <ConservationStatus
                                conservationStatus={conservationStatus}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                                lightboxIdentifier={`plantPage`}
                                toggleLightboxCallback={() =>
                                    toggleLightbox()
                                }
                            />
                            <Tidbits
                                tidbits={tidbits}
                                tocLinks={sectionLinks}
                                openToCSection={openToCSection}
                                setShowToC={setShowToC}
                                lightboxIdentifier={`plantPage`}
                                toggleLightboxCallback={() =>
                                    toggleLightbox()
                                }
                            />
                        </div>
                    </main>
                    <Lightbox
                        cols={3}
                        images={images}
                        lightboxIdentifier="plantPage"
                        maxItems={6}
                        onOpenCallback={toggleLightbox}
                        onCloseCallback={closeLightbox}
                        open={isLightboxOpen}
                        slideshow={true}
                        thumbnailWidth={150}
                    />
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
