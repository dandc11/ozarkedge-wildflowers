import React from 'react';
import PropTypes from 'prop-types';
import { sanityClient } from '@lib/sanity.server';
import { GET_ALL_NATIVE_PLANT_PATHS_QUERY } from '@lib/queries';
import { MONTH_NAMES } from '@lib/utilities/constants';
import PlantName from 'components/PlantName';
import { titleCase } from '@lib/utilities/helperUtil';
import PortTextWrapper from 'components/PortableText';
import cx from 'classnames';

const NativePlantPage = ({ plantPageData }) => {
    const {
        conservationStatus = '',
        description = '',
        flowerColor = '',
        floweringMonths = '',
        floweringSeason = '',
        growingNearbyText = '',
        habitat = '',
        images = '',
        plantName = '',
        previewImage = '',
        tidbits = '',
    } = plantPageData;
    console.log('plant page data ', plantPageData);
    return (
        <div className="px-6 bp-700:px-12 bp-1100:px-18">
            <div className={`max-w-[18rem]`}>
                <PlantName align={`right`} plantName={plantName}></PlantName>
            </div>
            <h2 className={`text-3xl`}>Plant Name Info</h2>
            <PortTextWrapper
                value={plantName?.nameInformation}
            ></PortTextWrapper>
            <br></br>
            <h2 className={`text-3xl`}>Description</h2>
            <PortTextWrapper value={description}></PortTextWrapper>
            <br></br>
            <h2 className={`text-3xl`}>Flower Color</h2>
            <p>{titleCase(flowerColor)}</p>
            <br></br>
            <h2 className={`text-3xl`}>Flowering Months</h2>
            {floweringMonths &&
                floweringMonths.map((month, index) => (
                    <p key={index}>{MONTH_NAMES[month - 1]}</p>
                ))}
            <br></br>
            <h2 className={`text-3xl`}>Flowering Season</h2>
            <p>
                {floweringSeason.charAt(0).toUpperCase() +
                    floweringSeason.slice(1)}
            </p>
            <br></br>
            <h2 className={`text-3xl`}>Growing Nearby</h2>
            <PortTextWrapper value={growingNearbyText}></PortTextWrapper>
            <br></br>
            <h2 className={`text-3xl`}>Habitat</h2>
            <PortTextWrapper value={habitat}></PortTextWrapper>
            <br></br>
            <h2 className={`text-3xl`}>Tidbits</h2>
            {/* TODO handle links  */}
            <PortTextWrapper value={tidbits}></PortTextWrapper>
            <br></br>
            <h2 className={`text-3xl`}>Conservation Status</h2>
            {/* TODO handle links */}
            <PortTextWrapper value={conservationStatus}></PortTextWrapper>
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
    const plantPageData = await sanityClient.fetch(
        `
        *[_type == "nativePlant" && slug.current == $slug][0] {
            ...,
            conservationStatus[]{
              ...,
              markDefs[]{
                ...,
                _type == "internalLink" => {
                    "slug": @.reference->slug,
                    "docType": @.reference->_type
             
                }
              }
            },description[]{
              ...,
              markDefs[]{
                ...,
                _type == "internalLink" => {
                    "slug": @.reference->slug,
                    "docType": @.reference->_type
             
                }
              }
            },growingNearbyText[]{
              ...,
              markDefs[]{
                ...,
                _type == "internalLink" => {
                    "slug": @.reference->slug,
                    "docType": @.reference->_type
             
                }
              }
            },plantName{
                ...,
                nameInformation[]{
                    ...,
                    markDefs[]{
                        ...,
                        _type == "internalLink" => {
                            "slug": @.reference->slug,
                            "docType": @.reference->_type
                        }
                    }
                }
            },tidbits[]{
              ...,
              markDefs[]{
                ...,
                _type == "internalLink" => {
                    "slug": @.reference->slug,
                    "docType": @.reference->_type
             
                }
              }
            },habitat[]{
              ...,
              markDefs[]{
                ...,
                _type == "internalLink" => {
                    "slug": @.reference->slug,
                    "docType": @.reference->_type
                }
              }
            }
          }
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
