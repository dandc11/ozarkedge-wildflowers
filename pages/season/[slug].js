import React from 'react';

import { sanityClient } from '@lib/sanity.client';
import { GET_ALL_SEASON_PATHS_QUERY } from '@lib/queries';
import PlantName from 'components/PlantName';

const SeasonPage = ({ plantPageData }) => {
    // const {
    //     conservationStatus,
    //     description,
    //     floweringColor,
    //     floweringMonths,
    //     floweringSeason,
    //     growingNearbyText,
    //     habitat,
    //     images,
    //     plantName,
    //     previewImage,
    //     tidbits,
    // } = plantPageData;
    return (
        <div>
            {/* <PlantName plantName={plantName}></PlantName> */}
        </div>
    );
};

export async function getStaticPaths() {
    const plantPagePaths = await sanityClient.fetch(GET_ALL_SEASON_PATHS_QUERY);
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
        *[_type == "season" && slug.current == $slug][0] {...}
        `,
        { slug }
    );
    return {
        props: {
            plantPageData,
        },
    };
}

export default SeasonPage;
