import React from 'react';
import PropTypes from 'prop-types';
import { getClient } from '@lib/sanity';
import { GET_ALL_NATIVE_PLANTS_QUERY } from '@lib/queries';
import PlantName from 'components/PlantName';
import CustomLink from 'components/CustomLink';

const AllNativePlantsPage = ({ nativePlantPageData }) => {
    return (
        <>
            <div>
              <h1>Ozerkedge Native Plants</h1>
                {nativePlantPageData &&
                    nativePlantPageData.map((plant) => (
                      <CustomLink docType={'nativePlant'} href={plant.slug.current}>
                        <PlantName plantName={plant.plantName} showSeparator={false} showBotanicalName={false}></PlantName>
                      </CustomLink>
                    ))}
            </div>
        </>
    );
};

export async function getStaticProps(context) {
    const nativePlantPageData = await getClient().fetch(
        GET_ALL_NATIVE_PLANTS_QUERY
    );
    return {
        props: { nativePlantPageData },
    };
}

AllNativePlantsPage.propTypes = {};

export default AllNativePlantsPage;
