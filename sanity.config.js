// sanity.config.js
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { defineConfig } from 'sanity'
import { muxInput } from 'sanity-plugin-mux-input'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'

import * as resolve from './sanity/presentation/resolve'
import { schema } from './schemas/schema'
import { structure } from './sanity/structure'
import { OpenInPresentationAction } from './sanity/actions/OpenInPresentationAction'

// Prefer SANITY_STUDIO_* env vars for Studio, but fall back to NEXT_PUBLIC_* vars
// so local development works when only the Next.js env names are configured.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2024-10-28'

if (!projectId) {
  throw new Error(
    'Missing Sanity project ID. Set SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID.',
  )
}

if (!dataset) {
  throw new Error(
    'Missing Sanity dataset. Set SANITY_STUDIO_DATASET or NEXT_PUBLIC_SANITY_DATASET.',
  )
}

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
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_SITE_URL ||
          (typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://ozarkedgewildflowers.com'),
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
    actions: (prev, context) =>
      context.schemaType === 'welcomeSection'
        ? [...prev.filter((action) => action.action !== 'duplicate'), OpenInPresentationAction]
        : [...prev, OpenInPresentationAction],
  },
})
