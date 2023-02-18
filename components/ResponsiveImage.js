import Image from 'next/image';
import { useNextSanityImage } from 'next-sanity-image';
import { sanityClient } from '@lib/sanity.server';
import cx from 'classnames';

const myCustomImageBuilder = (imageUrlBuilder, options) => {
    return imageUrlBuilder
        .width(
            options.width ||
                Math.min(options.originalImageDimensions.width, 800)
        )
        .fit('clip');
};

const ResponsiveImage = ({
    id,
    className,
    figureClassName,
    height,
    image,
    mobileWidth,
    mobileImage = false,
    priority = false,
    placeholder = ``,
    quality = `100`,
    fill = false,
    showCaption = true,
    sizes,
    style,
    width,
    wrapperClassName,
    ...props
}) => {
    const imageProps = useNextSanityImage(sanityClient, image);
    const mobileImageProps = mobileImage
        ? useNextSanityImage(sanityClient, image, {
              imageBuilder: myCustomImageBuilder,
          })
        : '';
    const { caption = '', alt = '' } = image;
    const classes = cx(className);
    const wrapperClasses = cx(
        'overflow-hidden ',
        wrapperClassName
    );
    const figureClasses = cx(
        'relative overflow-hidden rounded-md',
        figureClassName
    );
    return (
        <div id={id} className={wrapperClasses}>
            <figure className={figureClasses}>
                <Image
                    {...imageProps}
                    className={classes + ` img-desktop`}
                    alt={alt}
                    placeholder={placeholder}
                    priority={priority}
                    quality={quality}
                    sizes={sizes}
                    style={style}
                    // fill={fill}
                    width={imageProps.width}
                    height={imageProps.height}
                />
                {showCaption && caption && (
                    <figcaption
                        className={`text-white absolute bottom-0 rounded-bl-md overflow-hidden bg-black opacity-70 text-base py-0 px-2`}
                    >
                        {caption}
                    </figcaption>
                )}
            </figure>
            {/* output separate image/crop at mobile size if one exists */}
            {mobileImage && (
                <Image
                    {...mobileImageProps}
                    className={classes + ` img-mobile`}
                    alt={altText}
                    priority={priority}
                    quality={quality}
                    // placeholder={placeholder}
                    // mobileWidth={mobileWidth}
                    // mobileHeight={mobileHeight}
                    sizes={sizes}
                />
            )}
        </div>
    );
};

export default ResponsiveImage;
