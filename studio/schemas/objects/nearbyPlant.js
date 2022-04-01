export default {
  name: "nearbyPlant",
  title: "Nearby Plant",
  type: "object",
  fields: [
    {
      name: "nearbyPlant",
      title: "Nearby Native Plant",
      type: "reference",
      to: [{ type: "nativePlant" }],
    },
    {
      name: "nearbyPlantImage",
      title: "Nearby Native Plant Image",
      type: "figure",
    },
  ],
};
