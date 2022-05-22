export default {
  name: "figure",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
    metadata: [
      "blurhash", // Default: included
      "lqip", // Default: included
      "palette", // Default: included
    ],
  },
  fields: [
    {
      title: "Caption",
      name: "caption",
      type: "string",
      description: "Optional caption text for this image.",
      options: {
        isHighlighted: true,
      },
    },
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      validation: (Rule) =>
        Rule.error("You have to fill out the alternative text.").required(),
      description:
        "A brief description of the image that will appear only in the html - important for SEO and accessiblity.",
      options: {
        isHighlighted: true,
      },
    },
  ],
  preview: {
    select: {
      imageUrl: "asset.url",
      title: "caption",
    },
  },
};
