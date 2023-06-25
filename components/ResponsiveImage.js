import Image from 'next/image';
import { useNextSanityImage } from 'next-sanity-image';
import { sanityClient } from '@lib/sanity.server';
import cx from 'classnames';

const ResponsiveImage = ({
    breakpoint = '',
    captionBgClass = 'bg-oe-green-yellow-200',
    captionStyle = 'inset',
    children,
    className = '',
    figureClassName = '',
    fill = false,
    height,
    id = '',
    image = '',
    lightboxIdentifier,
    mobileWidth = '',
    mobileImage = false,
    onClick = () => {},
    placeholder = ``,
    priority = false,
    quality = `100`,
    showCaption = true,
    sizes = '',
    style = '',
    width,
    wrapperClassName = '',
    ...props
}) => {
    const imageProps = useNextSanityImage(sanityClient, image);
    const mobileImageProps = useNextSanityImage(sanityClient, mobileImage);
    const imgWidth =
        typeof parseInt(width, 10) === Number
            ? typeof parseInt(width, 10)
            : null;
    const imgHeight =
        typeof parseInt(height, 10) === Number
            ? typeof parseInt(height, 10)
            : null;
    const classes = cx(className);
    const { caption = '', alt = '' } = image ? image : {};
    const captionClassName = cx(`inset-caption`);

    return (
        <>
            {image && (
                <div id={id} className={cx('img-base', wrapperClassName)}>
                    <figure
                        className={cx(`img-base`, figureClassName)}
                        onClick={onClick}
                    >
                        <Image
                            {...imageProps}
                            alt={alt}
                            className={cx(classes, ` img-desktop`, {
                                ' !hidden bp-500:!block': mobileImage,
                            })}
                            data-lightboxjs={lightboxIdentifier}
                            placeholder={placeholder}
                            priority={priority}
                            quality={quality}
                            sizes={sizes}
                            // fill={fill}
                            style={style}
                        />
                        {/* output separate image/crop at mobile size if one exists */}
                        {mobileImage && (
                            <Image
                                {...mobileImageProps}
                                className={
                                    classes + ` img-mobile bp-500:!hidden`
                                }
                                alt={alt}
                                priority={priority}
                                quality={quality}
                                data-lightboxjs={lightboxIdentifier}
                                // placeholder={placeholder}
                                sizes={sizes}
                            />
                        )}
                        {children && children}
                        {caption && showCaption && (
                            <figcaption className={cx(captionClassName, captionBgClass)}>
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
