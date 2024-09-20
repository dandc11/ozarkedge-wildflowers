import { definePlugin } from 'sanity';

import { getPreviewSecret } from './previewSecret';

// This plugin sets up the "Open preview (CTRL + ALT + O)" in the dropdown menu that hosts
// other actions like "Review changes" and "Inspect"
// @TODO the code in this plugin is a candidate for moving into `@sanity/preview-kit/studio`

export const productionUrl = definePlugin(({ previewSecretId, types: _types, apiVersion = '2022-11-17' }) => {
  if (!previewSecretId) {
    // Throw an error if `previewSecretId` is missing
    throw new TypeError('`previewSecretId` is required');
  }
  if (!previewSecretId.includes('.')) {
    // Throw an error if `previewSecretId` doesn't contain a `.` to ensure it can only be queried by authenticated users
    throw new TypeError(
      '`previewSecretId` must contain a `.` to ensure it can only be queried by authenticated users'
    );
  }
  if (!_types || _types.length === 0) {
    // Throw an error if `types` is missing or empty
    throw new TypeError('`types` is required');
  }
  const types = new Set(_types);
  return {
    name: 'productionUrl',
    document: {
      productionUrl: async (prev, { document, getClient }) => {
        const url = new URL('/api/preview', location.origin);

        const client = getClient({ apiVersion });
        const secret = await getPreviewSecret({
          client,
          id: previewSecretId,
          createIfNotExists: true,
        });
        if (secret) {
          url.searchParams.set('secret', secret);
        }
        const slug = document.slug?.current;
        if (slug) {
          url.searchParams.set('slug', slug);
        }

        if (types.has(document._type)) {
          // Set the 'type' query parameter if the 'document._type' is in the 'types' array
          url.searchParams.set('type', document._type);
          return url.toString();
        }

        return prev;
      },
    },
  };
});
