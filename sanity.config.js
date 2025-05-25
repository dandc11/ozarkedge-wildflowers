// sanity.config.js
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { defineConfig } from 'sanity'
import { muxInput } from 'sanity-plugin-mux-input'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'

import * as resolve from './sanity/presentation/resolve'
import { apiVersion, dataset, projectId } from './sanity/lib/sanity.api'
import { schema } from './schemas/schema'

// Create a Set to track schema type names and prevent duplicates
const schemaTypeNames = new Set()
const uniqueSchemaTypes = schema.types.filter((type) => {
  if (schemaTypeNames.has(type.name)) {
    console.warn(
      `Warning: Duplicate schema type name detected: "${type.name}". Keeping only the first definition.`,
    )
    return false
  }
  schemaTypeNames.add(type.name)
  return true
})

export default defineConfig({
  basePath: '/studio',
  title: 'Ozarkedge Wildflowers',
  projectId,
  dataset,
  schema: {
    types: uniqueSchemaTypes,
  },
  plugins: [
    // structureTool({ defaultDocumentNode }),
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    muxInput({ mp4_support: 'standard' }),
  ],
})
