import { useEffect } from 'react';
import { SlideshowLightbox, initLightboxJS } from 'lightbox.js-react';
import { SanityImage } from 'sanity-image';
import cx from 'classnames';
import { urlForImage } from '../lib/sanity.image';

/**
 * Lightbox component. Uses lightbox.js-react to display a lightbox slideshow.
 * @param {object} children - Children to display in the lightbox.
 * @param {string} className - Classes applied to the image grid.
 * @param {number} cols - Number of columns to display in the image grid.
 * @param {array} images - Array of images to be featured in the open lightbox.
 * @param {string} lightboxIdentifier - Identifier for the lightbox.
 * @param {string} lightboxImgClass - Class applied to the lightbox images.
 * @param {number} maxItems - Maximum number of items to display in the lightbox. TODO: Implement this.
 * @param {boolean} open - Opens the lightbox when true.
 * @param {function} onOpenCallback - Callback function to run when the lightbox is opened.
 * @param {function} onCloseCallback - Callback function to run when the lightbox is closed.
 * @param {boolean} showImageGrid - Whether to show the image grid or not.
 * @param {number} startingSlideIndex - Index of the slide to start on.
 * @param {number} thumbnailWidth - Width of the thumbnails.
 * @returns {JSX.Element} - Lightbox component. Displays a lightbox slideshow. Can display a grid of images.     
 */
const Lightbox = ({
    children,
    className,
    cols = 3,
    draftMode,
    images,
    lightboxIdentifier,
    lightboxImgClass,
    maxItems,
    open = false,
    onOpenCallback,
    onCloseCallback,
    showImageGrid = false,
    startingSlideIndex = 0,
    thumbnailWidth = 100,
}) => {
    // initialize lightbox.js
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY) {
            initLightboxJS(
                process.env.NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY,
                'individual'
            );
        }
    }, []);

    const gridColumns = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };

    const showChildren = !showImageGrid && children;
    const imageSrcAndAlt = [];
    const imageComponents = images?.map((image, index) => {
        // const imageProps = useNextSanityImage(sanityClient, image.asset);
        imageSrcAndAlt.push({ src: urlForImage(image), alt: image.alt });

        return (
            <>  </>
            // <Image
            //     {...imageProps}
            //     key={index}
            //     className={cx('rounded-md')}
            //     sizes={`25vw`}
            //     alt={image.alt}
            //     data-lightboxjs={lightboxIdentifier}
            //     quality={80}
            // />
        );
    });


    return (
        <>
            <SlideshowLightbox
                className={cx({
                    [`grid ${gridColumns[cols]} gap-2`]: showImageGrid,
                    className,
                })}
                framework="next"
                fullScreen={true}
                iconColor="white"
                images={imageSrcAndAlt}
                leftArrowClassname={'text-white text-2xl'}
                lightboxIdentifier={lightboxIdentifier}
                lightboxImgClass={'!w-full h-auto'}
                onClose={onCloseCallback ? onCloseCallback : () => {}}
                open={open}
                rightArrowClassname={'text-white text-2xl'}
                showControls={true}
                showThumbnails={true}
                slideshowInterval={3500}
                startingSlideIndex={startingSlideIndex}
                theme="lightbox"
                thumbnailBorder="silver"
            >
                {showImageGrid &&
                    imageComponents.map((image, index) => {
                        return <div key={index}>{image}</div>;
                    })}
                {showChildren && children}
            </SlideshowLightbox>
        </>
    );
};

export default Lightbox;
