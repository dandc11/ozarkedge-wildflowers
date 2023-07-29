import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
    /**
     * https://nextjs.org/docs/basic-features/environment-variables
     **/
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'prod',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: '2022-04-20', // or today's date for latest
    /**
     * Set useCdn to `false` if your application require the freshest possible
     * data always (potentially slightly slower and a bit more expensive).
     * Authenticated request (like preview) will always bypass the CDN
     **/
    useCdn: process.env.NODE_ENV === 'prod',
    perspective: 'published',
};

export function getClient(preview) {
    const sanityClient = createClient(config);
    if (preview) {
        console.log('preview ', preview)
        if (!preview.token) {
            throw new Error(
                'The preview token is missing. Cannot preview drafts.'
            );
        }
        return sanityClient.withConfig({
            token: preview.token,
            useCdn: false,
            ignoreBrowserTokenWarning: true,
            perspective: 'previewDrafts',
        });
    }
    return sanityClient;
}

export const urlFor = (source) =>
    imageUrlBuilder(config).image(source).auto('format').url();
