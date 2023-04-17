import { createPreviewSubscriptionHook, createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import {config} from './config';

if (!config.projectId) {
  throw Error("The Project ID is not set. Check your environment variables.");
}
export const urlFor = (source) => imageUrlBuilder(config).image(source).auto('format');

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

