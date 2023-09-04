export default {
    name: 'page',
    title: 'Page',
    type: 'document',
    fieldsets: [
        {
          title: "SEO & metadata",
          name: "metadata",
        },
      ],
    fields: [
        {
            name: "title",
            type: "string",
            title: "Title",
          },
          {
            name: "content",
            type: "array",
            title: "Page sections",
            of: [{ type: "nativePlant" }, { type: "imageSection" }, { type: "textSection" }],
          },
          {
            name: "description",
            type: "text",
            title: "Description",
            description: "This description populates meta-tags on the webpage",
            fieldset: "metadata",
          },
    ],
}