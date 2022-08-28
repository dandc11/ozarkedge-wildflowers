import { urlFor } from '@lib/sanity';

// export const getImgUrlsForSrcSet = (image, width) => {
//     let widths = urlFor(image).width(550).url();
// };

// retuns a string of sizes for the img[sizes] attribute concatenated to any list of sizes passed
export const getDefaultImgSizes = (sizes) => {
    let defaultSizes = '(min-width: 900) 15vw, (min-width: 600px) 75vw, 100vw';
    return sizes ? `${sizes}, ${defaultSizes}` : defaultSizes;
};

/**
 * Returns an object of palette values according to the palette type
 * @param {Object} image
 * @param {string } paletteType
 * @returns {Object}
 */
export const getImagePalette = (image, paletteType) => {
    let paletteColors = {
        background: '#f34b3c',
        foreground: '#fff',
        population: 1292,
        title: '#fff',
    };
    if (image.palette)
        switch (paletteType) {
            case 'darkMuted':
                paletteColors = image.palette.darkMuted
                    ? image.palette.darkMuted
                    : paletteColors;
                break;
            case 'darkVibrant':
                paletteColors = image.palette.darkVibrant
                    ? image.palette.darkVibrant
                    : paletteColors;
                break;
            case 'dominant':
                paletteColors = image.palette.dominant
                    ? image.palette.dominant
                    : paletteColors;
                break;
            case 'lightMuted':
                paletteColors = image.palette.lightMuted
                    ? image.palette.lightMuted
                    : paletteColors;
                break;
            case 'lightVibrant':
                paletteColors = image.palette.lightVibrant
                    ? image.palette.lightVibrant
                    : paletteColors;
                break;
            case 'vibrant':
                paletteColors = image.palette.vibrant
                    ? image.palette.vibrant
                    : paletteColors;
                break;
            case 'muted':
                paletteColors = image.palette.muted
                    ? image.palette.muted
                    : paletteColors;
                break;
            default:
                break;
        }
    // console.log('palette ', paletteColors);
    return paletteColors;
};

/** Returns the image palette's background hex color
 * @param {Object} image
 * @param {string} paletteType
 * @returns {string} background
 */
export const getImagePaletteBackgroundColor = (image, paletteType) => {
    let palette = getImagePalette(image, paletteType);
    return palette.background;
};

/**
 * Returns the image palette's foreground hex color
 * @param {Object} image
 * @param {string} paletteType
 * @returns {string} foreground
 */
export const getImagePaletteForegroundColor = (image, paletteType) => {
    let palette = getImagePalette(image, paletteType);
    return palette.foreground;
};

/**
 * Returns the image palette's population
 * @param {Object} image
 * @param {string} paletteType
 * @returns {number} population
 */
export const getImagePalettePopulation = (image, paletteType) => {
    let palette = getImagePalette(image, paletteType);
    return palette.population;
};

/**
 * Returns the image palette's title hex color
 * @param {Object} image
 * @param {string} paletteType
 * @returns {string} title
 */
export const getImagePaletteTitleColor = (image, paletteType) => {
    let palette = getImagePalette(image, paletteType);
    return palette.title;
};
