import Image from 'next/image';
import { urlFor } from '@lib/sanity';

const composeSanityUrl = (image, altText) => {
    let url = urlFor(image).height(550).width(550).url();
    return url;
};

// const myLoader = ({ src, width, quality }) => {
//     return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
// };

const NextImage = ({ classNames, imgAsset, altText }) => {
    return (
        <Image
            className={classNames}
            // loader={myLoader}
            src={composeSanityUrl(imgAsset)}
            alt={altText}
            width={500}
            height={500}
        />
    );
};

export default NextImage;
