import React from 'react';
import PropTypes from 'prop-types';
import { sanityClient } from '@lib/sanity.server';
import { GET_ALL_NATIVE_PLANT_PATHS_QUERY } from '@lib/queries';
import { MONTH_NAMES } from '@lib/utilities/constants';
import PlantName from 'components/PlantName';
import PortTextWrapper from 'components/PortableText';

const NativePlantPage = ({ plantPageData }) => {
    const {
        conservationStatus,
        description,
        flowerColor,
        floweringMonths,
        floweringSeason,
        growingNearbyText,
        habitat,
        images,
        plantName,
        previewImage,
        tidbits,
    } = plantPageData;
    console.log('plant page data ', plantPageData);
    return (
        <div>
            <PlantName plantName={plantName}></PlantName>
            <h2>Plant Name Info</h2>
            <PortTextWrapper value={plantName.nameInformation}></PortTextWrapper>
            <br></br>
            <h2>Description</h2>
            <PortTextWrapper value={description}></PortTextWrapper>
            <br></br>
            <h2>Flower Color</h2>
            <p>{flowerColor}</p>
            <br></br>
            <h2>Flowering Months</h2>
            {floweringMonths && floweringMonths.map((month) => <p>{MONTH_NAMES[month - 1]}</p>)}
            <br></br>
            <h2>Flowering Season</h2>
            <p>{floweringSeason}</p>
            <br></br>
            <h2>Growing Nearby</h2>
            <PortTextWrapper value={growingNearbyText}></PortTextWrapper>
            <br></br>
            <h2>Habitat</h2>
            <PortTextWrapper value={habitat}></PortTextWrapper>
            <br></br>
            <h2>Tidbits</h2>
            {/* TODO handle links  */}
            <PortTextWrapper value={tidbits}></PortTextWrapper>
            <br></br>
            <h2>Conservation Status</h2>
            {/* TODO handle links */}
            <PortTextWrapper value={conservationStatus}></PortTextWrapper>
        </div>
    );
};

export async function getStaticPaths() {
    const plantPagePaths = await sanityClient.fetch(GET_ALL_NATIVE_PLANT_PATHS_QUERY);
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
    const plantPageData = await sanityClient.fetch(
        `
        *[_type == "nativePlant" && slug.current == $slug][0] {...}
        `,
        { slug }
    );
    return {
        props: {
            plantPageData,
        },
    };
}

NativePlantPage.propTypes = {};

export default NativePlantPage;
