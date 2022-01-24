import { GiHouse } from "react-icons/gi";

export default {
  name: "landingPage",
  title: "Landing page",
  icon: GiHouse,
  type: "document",
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ["update", "publish" /* 'create', 'delete' */],
  fields: [
    {
      name: "titleText",
      title: "Title Text",
      description: "This is the text for landing page banner.",
      type: "string",
    },
    {
      name: "subtitleText",
      title: "Subtitle Text",
      description:
        "This is the text for the subtitle beneath the banner. Leave it empty if you don't want any to appear.",
      type: "text",
    },
    {
      name: "mainImage",
      title: "Main Image",
      description: "Select the main landing page.",
      type: "mainImage",
    },
  ],
};
