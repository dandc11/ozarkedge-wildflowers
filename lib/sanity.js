import imageUrlBuilder from "@sanity/image-url";
import {config} from './config';

if (!config.projectId) {
  throw Error("The Project ID is not set. Check your environment variables.");
}
export const urlFor = (source) => imageUrlBuilder(config).image(source).auto('format').url();


