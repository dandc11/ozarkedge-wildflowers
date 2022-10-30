import Image from 'next/image';
import { urlFor } from '@lib/sanity';
import { useNextSanityImage } from 'next-sanity-image';
import { sanityClient } from '@lib/sanity.server';
import { getImgUrlsForSrcSet } from '@lib/imageUtil';
import { getDefaultImgSizes } from '@lib/imageUtil';

const composeSanityUrls = (image, altText) => {
    // let url = urlFor(image).height(550).width(550).url();
    // return url;
};

{
    /*** ResponsiveImage example
     *  <ResponsiveImage
        classNames={'hero-image'}
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

const ResponsiveImage = ({
    priority = false,
    placeholder = `empty`,
    quality = `100`,
    classNames,
    image,
    altText,
    mobileImage = false,
    ...props
}) => {
    const imageProps = useNextSanityImage(sanityClient, image);
    const mobileImageProps = mobileImage
        ? useNextSanityImage(sanityClient, image)
        : '';
    return (
        <div className="imageContainer">
            <Image
                {...imageProps}
                layout="responsive"
                className={[...classNames, ' screen-large']}
                alt={altText}
                placeholder={placeholder}
                priority={priority}
                quality={quality}
                // sizes="(max-width: 1600px) 100vw, 1600px"
                // sizes={getDefaultImgSizes()}
            />
            {/* output separate image/crop at mobile size if one exists */}
            {mobileImage && (
                <Image
                    {...mobileImageProps}
                    layout="responsive"
                    className={[...classNames, 'screen-small']}
                    alt={altText}
                    placeholder={placeholder}
                    priority={priority}
                    quality={quality}
                    // sizes="(max-width: 1600px) 100vw, 1600px"
                    // sizes={getDefaultImgSizes()}
                />
            )}
        </div>
    );
};

export default ResponsiveImage;
