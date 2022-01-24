import { GiFlowerEmblem } from "react-icons/gi";

export default {
  name: "nativePlant",
  title: "Native Plants",
  icon: GiFlowerEmblem,
  type: "document",
  fieldsets: [
    {
      name: "name",
      title: "Name",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "metadata",
      title: "Plant Metadata",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "description",
      title: "Description",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "growingNearby",
      title: "Habitat and Nearby Plants",
      options: { collapsible: true, collapsed: true },
    },
  ],
  preview: {
    select: {
      title: "plantName.botanicalName",
      media: "previewImage", // Use the previewImage field as thumbnail
    },
  },
  fields: [
    {
      name: "plantName",
      title: "Name",
      type: "plantName",
      fieldset: "name",
    },
    {
      name: "slug",
      title: "Slug",
      description:
        "A short, hyphenated version of the plant name for use in URLs.",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "plantName.botanicalName",
        validation: (Rule) => [Rule.unique()],
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
      fieldset: "metadata",
    },
    {
      name: "plantIdentificationTags",
      type: "array",
      title: "Plant Identification Tags",
      description:
        "Add one or more features by which to identify this plant. Keep it short (hit Enter for each one). ",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      fieldset: "metadata",
    },
    {
      name: "previewImage",
      title: "Plant Thumbnail Image",
      description:
        "Choose an image to act as a thumbnail for this plant's entry in the Sanity Studio.",
      type: "image",
      options: {
        hotspot: true, // <-- Defaults to false
      },
      fieldset: "metadata",
    },
    {
      name: "images",
      type: "array",
      title: "Plant Image Gallery",
      description:
        "Upload or select images of this plant to appear in a gallery on the plant's page.",
      of: [{ type: "image" }],
      fieldset: "description",
    },
    {
      name: "description",
      title: "Plant Description",
      description:
        "This will serves as the main content of the plant's page. Feel free to add images or other content.",
      type: "plantPortableText",
      fieldset: "description",
    },
    {
      name: "genre",
      title: "Flower Color",
      type: "string",
      options: {
        list: [
          { title: "White", value: "white" },
          { title: "Blue", value: "blue" },
          { title: "Purple", value: "purple" },
          { title: "Pink", value: "pink" },
          { title: "Red", value: "red" },
          { title: "Orange", value: "orange" },
          { title: "Yellow", value: "yellow" },
          { title: "Brown", value: "brown" },
          { title: "Green", value: "green" },
        ],
        layout: "radio", // <-- defaults to 'dropdown'
      },
      fieldset: "description",
    },
    {
      name: "bloomSeason",
      title: "Bloom Season",
      type: "string",
      options: {
        list: [
          { title: "Spring", value: "spring" },
          { title: "Summer", value: "summer" },
          { title: "Autumn", value: "autumn" },
          { title: "Winter", value: "winter" },
        ], // <-- predefined values
        layout: "radio", // <-- defaults to 'dropdown'
      },
      fieldset: "description",
    },
    {
      name: "conservationStatus",
      title: "Conservation Status",
      description:
        "This is where you can add any information about the plant's conservation status.",
      type: "plantPortableText",
      fieldset: "description",
    },
    {
      name: "habitat",
      title: "Habitat",
      type: "plantPortableText",
      fieldset: "growingNearby",
    },
    {
      name: "growingNearbyPlantList",
      title: "List native plants growing nearby",
      type: "array",
      description:
        "List any plants growing nearby. Hit Enter to delineate each one. Only published native plants can be referenced.",
      of: [{ type: "reference", to: { type: "nativePlant" } }],
      fieldset: "growingNearby",
    },
    {
      name: "growingNearbyText",
      title: "What's growing nearby?",
      description:
        "This is where you can add any additional information about what's growing near this plant.",
      type: "plantPortableText",
      fieldset: "growingNearby",
    },
  ],
};
