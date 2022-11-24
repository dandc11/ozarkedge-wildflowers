import React from 'react';
import { urlFor, usePreviewSubscription } from '@lib/sanity';
import {
    getImagePaletteBackgroundColor,
    getImagePaletteForegroundColor,
    getImagePaletteTitleTextColor,
} from '@lib/imageUtil';
import PropTypes from 'prop-types';

const buildContainerBackground = (containerProps) => {
    const {
        display,
        bgImage,
        bgImageMedium,
        bgImageSmall,
        bgSize,
        bgImagePositionString,
        bgColor,
        bgBlendMode,
        opacity,
        tag = 'div',
    } = containerProps;
    let styleObject = {};

    // if there's a background image...
    if (bgImage) {
        let bgImageUrl = `url('${urlFor(bgImage)}')`;

        //...get url values for any responsive image sizes
        let bgImageMediumUrl = bgImageMedium
            ? `url('${urlFor(bgImageMedium)}')`
            : bgImageUrl;

        let bgImageSmallUrl = bgImageSmall
            ? `url('${urlFor(bgImageSmall)}')`
            : bgImageUrl;


        // ...set CSS variables
        styleObject['--bg-large'] = `${bgImageUrl} ${bgImagePositionString}`;
        styleObject['--bg-medium'] = `${bgImageMediumUrl} ${bgImagePositionString}`;
        styleObject['--bg-small'] = `${bgImageSmallUrl} ${bgImagePositionString}`;
    }

    if (bgColor) {
        styleObject.backgroundColor =
            bgColor !== 'palette'
                ? bgColor
                : getImagePaletteBackgroundColor(bgImage, 'darkVibrant');
        if (opacity) {
            styleObject.backgroundColor = `${
                styleObject.backgroundColor + opacity
            }`;
        }
    }
    if (bgBlendMode) {
        styleObject.backgroundBlendMode = bgBlendMode;
    }
    return styleObject;
};

const buildClassArray = (classes, containerProps) => {
    const { display } = containerProps;
    classes = [...classes, 'container'];
    let classArray = classes.join(' ');
    return classArray;
};

const Container = ({ classes, children, ...props }) => {
    const { tag } = props;
    const bgStyle = buildContainerBackground(props);
    const classArray = buildClassArray(classes, props);

    return (
        <>
            {tag === 'none' && <>{children}</>}
            {tag === 'div' && (
                <div className={classArray} style={bgStyle}>
                    {children}
                </div>
            )}
            {tag === 'section' && (
                <section className={classArray} style={bgStyle}>
                    {children}
                </section>
            )}
        </>
    );
};

Container.defaultProps = {
    tag: 'div',
};

Container.propTypes = {};

export default Container;
