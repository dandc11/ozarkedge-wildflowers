import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';
import ResponsiveImage from './ResponsiveImage';
import { PortableText } from '@portabletext/react';

const SeasonsPreview = (props) => {
    const { seasonData } = props;
    console.log('season data in preview ', seasonData)
    const { mainImage } = seasonData[0];
    return (
        <div className={`seasons-preview`}>
            <h2 className={`season-header`}>Summer at Ozarkedge</h2>
            <ResponsiveImage
                classes={['thumbnail', 'featured-image']}
                // slug={plant.slug.current}
                placeholder="empty"
                // blurDataURL={plant.previewImage.asset.lqip}
                // style={{
                //     width: '100%',
                //     height: '100%',
                // }}
                sizes="(max-width: 700px) 90vw, 700px"
                image={mainImage.asset}
                alt={mainImage.alt}
            />
            <p className={`season-body`}>
                {' '}
                {/* <ResponsiveImage
                    classes={['thumbnail', 'featured-image']}
                    slug={plant.slug.current}
                    placeholder="empty"
                    blurDataURL={plant.previewImage.asset.lqip}
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={plant.previewImage.asset}
                    // fill="false"
                    // width={'500'}
                    // height={'800'}
                    // mobileWIdth={'300'}
                /> */}
                It heats up in summer on Ozarkedge. The normal temperature in
                June is around 85, by July it hits 90, and in August the low
                90’s prevail. On any given day we can hit 100 or more. We
                occasionally get relief from the heat when the temps dip into
                the 80’s. Those are days to be celebrated. The humidity tends to
                be high, so the heat index often reaches above 100. July and
                August are particularly prone to long spells without rainfall.
                Find out more about seasons in the area
            </p>
            <br></br>
            <Link href="/seasons">Read more aobut seasons</Link>
        </div>
    );
};

SeasonsPreview.propTypes = {};

export default SeasonsPreview;
