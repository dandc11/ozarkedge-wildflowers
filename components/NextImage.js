import Image from 'next/image';
import { urlFor } from '@lib/sanity';
import { useNextSanityImage } from 'next-sanity-image';
import { sanityClient } from '@lib/sanity.server';
import { getImgUrlsForSrcSet } from '@lib/helperFunctions';
import { getDefaultImgSizes } from '@lib/helperFunctions';

const composeSanityUrls = (image, altText) => {
    // let url = urlFor(image).height(550).width(550).url();
    return imageProps;
};

{
    /*** NextImage example
     *  <NextImage
        classNames={'hero-image'}
        altText={mainImage.alt}
        imgAsset={mainImage}
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

const NextImage = ({
    priority,
    placeholder,
    quality,
    classNames,
    imgAsset,
    altText,
}) => {
    const imageProps = useNextSanityImage(sanityClient, imgAsset);
    return (
        <Image
            {...imageProps}
            layout="responsive"
            className={classNames}
            alt={altText}
            placeholder={placeholder ? placeholder : `empty`}
            priority={priority ? priority : false}
            quality={quality ? quality : `100`}
            // sizes="(max-width: 1600px) 100vw, 1600px"
            // sizes={getDefaultImgSizes()}
        />
        // <img
        //     src={urlFor(imgAsset).width(550).url()}
        //     srcSet={getImgUrlsForSrcSet(imgAsset)}
        //     sizes={getDefaultImgSizes()}
        // />
    );
};

export default NextImage;
