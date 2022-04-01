import { GiBee } from "react-icons/gi";

export default {
  name: "pollinator",
  title: "Pollinators",
  icon: GiBee,
  type: "document",
  fieldsets: [],
  preview: {
    select: {
      title: "name",
      media: "previewImage", // Use the previewImage field as thumbnail
    },
  },
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "figure",
    },
  ],
};
