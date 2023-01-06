import Image from 'next/image';
import { useNextSanityImage } from 'next-sanity-image';
import { sanityClient } from '@lib/sanity.server';
import cx from 'classnames';

{
    /*** ResponsiveImage example
     *  <ResponsiveImage
    classes={'hero-image'}
    altText={mainImage.alt}
    image={mainImage}
    quality={`100`}
    /> */
}
{
    /*** img with Sanity urlFor
     <img
     className="hero-img"
     src={urlFor(data.mainImage)
        .height(550)
        .width(550)
        .url()}
        alt={data.mainImage.alt}
    /> */
}
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
    classes,
    height,
    image,
    mobileWidth,
    mobileImage = false,
    priority = false,
    placeholder = `blur`,
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
    const classNames = cx(classes);
    const wrapperClassNames = cx(wrapperClasses, 'img-wrapper');
    return (
        <div className={wrapperClassNames}>
            <figure className={'img-figure'}>
                <Image
                    {...imageProps}
                    className={classNames + ' img-desktop'}
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
                {caption && <figcaption>{caption}</figcaption>}
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
