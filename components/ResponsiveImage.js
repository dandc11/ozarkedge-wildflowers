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
    breakpoint = '',
    className,
    figureClassName,
    captionClassName,
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
        ? useNextSanityImage(sanityClient, mobileImage, {
              imageBuilder: myCustomImageBuilder,
          })
        : '';
    const { caption = '', alt = '' } = image ? image : {};
    const classes = cx(className);
    return (
        <>
            {image && (
                <div id={id} className={cx(wrapperClassName)}>
                    <figure className={cx(`img-base`, figureClassName)}>
                        <Image
                            {...imageProps}
                            className={cx(classes, ` img-desktop `, {
                                ' hidden bp-500:block': mobileImage
                            })}
                            alt={alt}
                            placeholder={placeholder}
                            priority={priority}
                            // quality={quality}
                            // sizes={sizes}
                            style={style}
                            // fill={fill}
                            width={imageProps.width}
                            height={imageProps.height}
                        />
                        {/* output separate image/crop at mobile size if one exists */}
                        {mobileImage && (
                            <Image
                                {...mobileImageProps}
                                className={
                                    classes + ` img-mobile bp-500:hidden`
                                }
                                alt={alt}
                                priority={priority}
                                quality={quality}
                                // placeholder={placeholder}
                                width={mobileImageProps.width}
                                height={mobileImageProps.height}
                                // sizes={sizes}
                            />
                        )}
                        {(caption && showCaption) && (
                            <figcaption className={cx(captionClassName)}>
                                {caption}
                            </figcaption>
                        )}
                    </figure>
                </div>
            )}
        </>
    );
};

export default ResponsiveImage;
