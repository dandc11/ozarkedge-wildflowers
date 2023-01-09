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
    alt = 'A flower at Ozarkedge',
    caption,
    className,
    height,
    image,
    mobileWidth,
    mobileImage = false,
    priority = false,
    placeholder = ``,
    quality = `100`,
    fill = false,
    sizes,
    style,
    width,
    wrapperClasses,
    ...props
}) => {
    const imageProps = useNextSanityImage(sanityClient, image);
    const mobileImageProps = mobileImage
        ? useNextSanityImage(sanityClient, image, {
              imageBuilder: myCustomImageBuilder,
          })
        : '';
    const classNames = cx(className);
    const wrapperClassNames = cx(wrapperClasses, 'img-wrapper');
    return (
        <div className={wrapperClassNames}>
            <figure className={'img-figure relative'}>
                <Image
                    {...imageProps}
                    className={classNames + ' img-desktop rounded-md'}
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
                {caption && <figcaption className={`text-white absolute bottom-0 w-full bg-black opacity-70 text-base py-0 px-2`}>{caption}</figcaption>}
            </figure>
            {/* output separate image/crop at mobile size if one exists */}
            {mobileImage && (
                <Image
                    {...mobileImageProps}
                    className={classNames + 'img-mobile'}
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
