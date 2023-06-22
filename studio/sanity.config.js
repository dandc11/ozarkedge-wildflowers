// sanity.config.js
import { defineConfig } from "sanity";
import { deskTool } from 'sanity/desk'
import schemas from './schemas/schema'
import { visionTool } from '@sanity/vision'
import {media, mediaAssetSource} from 'sanity-plugin-media'

export default defineConfig({
  title: "ozarkedge-wildflowers",
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_API_DATASET,
  plugins: [deskTool(), visionTool(), media()],
  form: {
    // Don't use this plugin when selecting files only (but allow all other enabled asset sources)
    file: {
      assetSources: previousAssetSources => {
        return previousAssetSources.filter(assetSource => assetSource !== mediaAssetSource)
      }
    }
  },
  tools: (prev) => {
    // 👇 Uses environment variables set by Vite in development mode
    if (import.meta.env.DEV) {
      return prev
    }
    return prev.filter((tool) => tool.name !== 'vision')
  },
  schema: {
    types: schemas,
  },
});