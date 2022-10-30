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
        bgImageLarge,
        bgImageMedium,
        bgImageSmall,
        bgSize,
        bgPosition,
        bgColor,
        bgBlendMode,
        opacity,
        tag = 'div',
    } = containerProps;
    let styleObject = {};
    if (bgImageLarge) {
        styleObject['--bg-large'] = `url('${urlFor(
            bgImageLarge
        )}') 0px 0px / cover no-repeat fixed`;
    }
    if (bgImageMedium) {
        styleObject['--bg-medium'] = `url('${urlFor(
            bgImageMedium
        )}') 0px 0px / cover no-repeat fixed`;
    }
    if (bgImageSmall) {
        styleObject['--bg-small'] = `url('${urlFor(
            bgImageSmall
        )}') 0px 0px / cover no-repeat fixed`;
    }
    if (bgColor) {
        styleObject.backgroundColor =
            bgColor !== 'palette'
                ? bgColor
                : getImagePaletteBackgroundColor(bgImageLarge, 'darkVibrant');
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
    console.log('class array ', classArray);
    return classArray;
};

const Container = ({ classes, children, ...props }) => {
    const { tag } = props;
    const bgStyle = buildContainerBackground(props);
    const classArray = buildClassArray(classes, props);
    console.log('styles ', bgStyle);

    // console.log('classes ', classArray);
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
