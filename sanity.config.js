// sanity.config.js
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { defineConfig } from 'sanity'
import { muxInput } from 'sanity-plugin-mux-input'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'

import * as resolve from './sanity/presentation/resolve'
import { schema } from './schemas/schema'
import { OpenInPresentationAction } from './sanity/actions/OpenInPresentationAction'

// Use SANITY_STUDIO_* env vars — Sanity's Vite bundler only exposes these to the browser.
// In .env.local, dotenv-expand aliases map these from the NEXT_PUBLIC_* vars that Next.js uses.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2024-10-28'

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
        origin: process.env.SANITY_STUDIO_SITE_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    muxInput({ mp4_support: 'standard' }),
  ],
  document: {
    actions: (prev) => [...prev, OpenInPresentationAction],
  },
})
