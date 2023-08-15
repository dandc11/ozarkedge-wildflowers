export default {
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  //   __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Site Title",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "Describe your site for search engines and social media.",
    },
    {
      name: "keywords",
      type: "array",
      title: "Keywords",
      description: "Add keywords that describe this site for SEO purposes.",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
  ],
};
