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

export default defineConfig({
  basePath: '/studio',
  title: 'Ozarkedge Wildflowers',
  projectId,
  dataset,
  schema,
  plugins: [
    // structureTool({ defaultDocumentNode }),
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    muxInput({ mp4_support: 'standard' }),
  ],
})
