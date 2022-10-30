import AssetSource from 'part:sanity-plugin-media-library/asset-source';

export default {
    name: 'responsiveImageArray',
    type: 'array',
    title: 'Responsive Image(s)',
    description:
        'Up to three images or versions of an image (different crops or hotspots) may be submitted. The first will apply on large screen widths, the second at medium widths, and the third on small screens.',
    of: [{ type: 'figure' }],
    options: { sources: [AssetSource] },
    fieldset: 'description',
};
