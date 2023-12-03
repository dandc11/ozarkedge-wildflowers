import { GiFlowerEmblem } from 'react-icons/gi'
import { defineArrayMember, defineType, defineField } from 'sanity'

// import AssetSource from 'part:sanity-plugin-media-library/asset-source';

export default defineType({
  name: 'nativePlant',
  title: 'Native Plants',
  icon: GiFlowerEmblem,
  type: 'document',
  groups: [
    {
      name: 'name',
      title: 'Plant Name',
      despcription: 'Add the common and botanical names for this plant.',
    },
    {
      name: 'metadata',
      title: 'Plant Metadata',
      despcription:
        'Add metadescription, tags and a thumbnail image for this plant.',
    },
    {
      name: 'description',
      title: 'Plant Description',
      despcription:
        'Add descriptive information about this plant, such as a lede, description text, image gallery, flower color, flowering season, pollinators and conservation status.',
    },
    {
      name: 'growingNearby',
      title: 'Habitat and Nearby Plants',
      despcription:
        'Add information about the habitat and plants growing nearby.',
    },
  ],
  preview: {
    select: {
      title: 'plantName.botanicalName',
      media: 'previewImage', // Use the previewImage field as thumbnail
    },
  },
  fields: [
    defineField({
      name: 'plantName',
      title: 'Name',
      type: 'plantName',
      group: 'name',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'mainImage',
      description:
        'Add a wide-cropped image to use as the banner image on wider screens. A crop with an 8/5 is preferrable.',
      options: {
        validation: (Rule) => [Rule.required()],
        hotspot: true,
      },
      group: 'name',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'A short, hyphenated version of the plant name for use in URLs. Generated slugs will have the format of common-name-botanical-name. Keep in mind that changing the slug of a published page will break any existing links to it both on the site and elswewhere.',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: (doc) =>
          `${doc.plantName.commonName}-${doc.plantName.botanicalName}`,
        validation: (Rule) => [Rule.unique()],
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
      group: 'metadata',
    }),
    defineField({
      name: 'plantIdentificationTags',
      type: 'array',
      title: 'Plant Identification Tags',
      description:
        'Add one or more features by which to identify this plant. Keep it short (hit Enter for each one). ',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
      group: 'metadata',
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      title: 'Meta-description',
      validation: [
        (Rule) => Rule.required(),
        (Rule) => Rule.max(200),
        (Rule) => Rule.min(40),
      ],
      description:
        'Add very brief description (one or two sentences) of this plant for search engines and to be presented when it is being featured on the site as a teaser section, like "Blooming Now".',
      group: 'metadata',
    }),
    defineField({
      name: 'previewImage',
      title: 'Plant Thumbnail Image',
      description:
        'Choose an image for this plant. Should be a portrait crop (3/4 aspect ratio).',
      type: 'mainImage',
      options: {
        hotspot: true, // <-- Defaults to false
      },
      group: 'metadata',
    }),
    defineField({
      name: 'images',
      type: 'array',
      title: 'Plant Image Gallery',
      description:
        "Upload or select images of this plant to appear in a gallery on the plant's page.",
      of: [defineArrayMember({ type: 'figure' })],
      // options: { sources: [AssetSource] },
      group: 'description',
    }),
    defineField({
      name: 'lede',
      title: 'Plant Lede',
      description:
        "Add the lede for this plant's page. Ledes are typically between 30-40 words.",
      type: 'pageBodyPortableText',
      group: 'description',
    }),
    defineField({
      name: 'bloomText',
      title: 'Bloom description',
      description: "Add any information about the plant's bloom.",
      type: 'pageBodyPortableText',
      group: 'description',
    }),
    defineField({
      name: 'pollinators',
      title: 'Pollinators description',
      description: "Add any information about the plant's pollinators.",
      type: 'pageBodyPortableText',
      group: 'description',
    }),
    defineField({
      name: 'pollinatorImages',
      type: 'array',
      title: 'Pollinator Image Gallery',
      description:
        "Upload or select images of pollinators associated with ths plant to appear in the pollinator section on this plant's page.",
      of: [defineArrayMember({ type: 'figure' })],
      // options: { sources: [AssetSource] },
      group: 'description',
    }),
    defineField({
      name: 'description',
      title: 'Plant Description',
      description:
        "Add a plant description to serve as the main text content on this plant's page. Images and other content can also be embedded.",
      type: 'pageBodyPortableText',
      group: 'description',
    }),
    defineField({
      name: 'flowerColor',
      title: 'Flower Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Blue', value: 'blue' },
          { title: 'Purple', value: 'purple' },
          { title: 'Pink', value: 'pink' },
          { title: 'Red', value: 'red' },
          { title: 'Orange', value: 'orange' },
          { title: 'Yellow', value: 'yellow' },
          { title: 'Brown', value: 'brown' },
          { title: 'Green', value: 'green' },
        ],
        layout: 'radio', // <-- defaults to 'dropdown'
      },
      group: 'metadata',
    }),
    defineField({
      name: 'floweringMonths',
      title: 'Flowering Months',
      type: 'array',
      of: [defineArrayMember({ type: 'number' })],
      options: {
        list: [
          { title: 'January', value: 1 },
          { title: 'February', value: 2 },
          { title: 'March', value: 3 },
          { title: 'April', value: 4 },
          { title: 'May', value: 5 },
          { title: 'June', value: 6 },
          { title: 'July', value: 7 },
          { title: 'August', value: 8 },
          { title: 'September', value: 9 },
          { title: 'October', value: 10 },
          { title: 'November', value: 11 },
          { title: 'December', value: 12 },
        ], // <-- predefined values
      },
      group: 'metadata',
    }),
    defineField({
      name: 'floweringSeason',
      title: 'Flowering Season',
      description:
        'Choose a season to associate this plant with. This will determine the season page it appears on.',
      type: 'string',
      options: {
        list: [
          { title: 'Spring', value: 'spring' },
          { title: 'Summer', value: 'summer' },
          { title: 'Fall', value: 'fall' },
          { title: 'Winter', value: 'winter' },
        ], // <-- predefined values
      },
      group: 'metadata',
    }),
    defineField({
      name: 'conservationStatus',
      title: 'Conservation Status',
      description: "Add any information about the plant's conservation status.",
      type: 'pageBodyPortableText',
      group: 'description',
    }),
    defineField({
      name: 'habitat',
      title: 'Habitat',
      type: 'pageBodyPortableText',
      group: 'growingNearby',
    }),
    defineField({
      name: 'growingNearbyPlantList',
      title: 'Native plants growing nearby',
      type: 'array',
      description:
        'Select or upload image(s) of plants growing near this one. For captions, provide the name of the plant. If this plant has its own page, provide a link to it. ',
      of: [
        defineArrayMember({
          type: 'figure',
        }),
      ],
      group: 'growingNearby',
    }),
    defineField({
      name: 'growingNearbyText',
      title: "What's growing nearby?",
      description:
        "Add any additional information about what's growing near this plant.",
      type: 'pageBodyPortableText',
      group: 'growingNearby',
    }),
    defineField({
      name: 'tidbits',
      title: 'Interesting Tidbits',
      type: 'pageBodyPortableText',
      group: 'description',
    }),
  ],
})
