export default {
  name: "plantName",
  title: "Plant Name",
  type: "object",
  fields: [
    {
      name: "botanicalName",
      title: "Botanical Name",
      type: "string",
    },
    {
      name: "commonName",
      title: "Common Name",
      type: "string",
    },
    {
      name: "nameInformation",
      title: "Plant Name Information",
      description:
        "Add any additional information about the plant's names here.",
      type: "plantPortableText",
    },
  ],
};
