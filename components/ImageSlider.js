import React, { createContext } from 'react';
import Link from 'next/link';import ResponsiveImage from './ResponsiveImage';
import { getInternalLinkFullPath } from '@lib/utilities/helperUtil';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * ImageSlider - component to render a horizontal slider of images
 * @param {string} captionBgClassName - background color for caption
 * @param {array} sliderItems - array of objects containing a image, link and documentType (optional)
 * @param {boolean} useLightbox - whether or not to use lightbox.js
 * @param {boolean} useLinks - whether or not to use links
 * @param {string} lightboxIdentifier - identifier for lightbox.js
 * @returns {JSX.Element}
 * @created 04-06-2023  
 * @lastUpdated 04-06-2023  
 */

const ImageSlider = (props) => {
    const {
        captionBgClassName,
        sliderItems,
        className = '',
        useLightbox = false,
        useLinks = false,
        lightboxIdentifier = '',
    } = props;

    const gridColumns = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };

    const listItems = sliderItems?.map((item, index) => {
        return (
            <li
                key={index}
                className={`relative flex flex-col h-full snap-center transition duration-200 ease-in-out hover:scale-105 first:hover:pl-2`}
            >
                {useLinks ? (
                    <Link
                        href={`${getInternalLinkFullPath(
                            item.docType,
                            item.slug
                        )}`}
                    >
                        <ResponsiveImage
                            className={`w-full aspect-[3/4] h-auto rounded-md`}
                            figureClassName={`img w-36 relative mb-5 bp-800:w-[15rem] bp-800:aspect-[3/4] bp-800:h-auto`}
                            wrapperClassName={``}
                            image={item.image}
                            sizes="(max-width: 800px) 150px, 240px"
                            mobileWidth
                            priority={false}
                            placeholder={``}
                            showCaption={true}
                            captionBgClassName={captionBgClassName}
                        />
                    </Link>
                ) : (
                    <ResponsiveImage
                        className={`w-full aspect-[3/4] h-auto `}
                        figureClassName={`img w-36 relative mb-5 rounded-md bp-800:w-[15rem] bp-800:aspect-[3/4] bp-800:h-auto`}
                        wrapperClassName={``}
                        image={item.image}
                        sizes="(max-width: 800px) 150px, 240px"
                        mobileWidth
                        priority={false}
                        placeholder={``}
                        showCaption={true}
                        captionBgClassName={captionBgClassName}
                    />
                )}
            </li>
        );
    });

    return (
        <div className={cx(`relative overflow-x-auto snap-x snap-mandatory w-full pt-2 hide-scroll`, className)}>
            <ul className={`flex flex-nowrap gap-3 h-full`}>
                {listItems}
            </ul>
        </div>
    );
};

ImageSlider.propTypes = {};

export default ImageSlider;
