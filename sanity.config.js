// sanity.config.js
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { buildLegacyTheme } from 'sanity'
import { deskTool } from 'sanity/desk'
import {muxInput} from 'sanity-plugin-mux-input'
import Iframe from 'sanity-plugin-iframe-pane'
import { media, mediaAssetSource } from 'sanity-plugin-media'
import { apiVersion, dataset, projectId } from './lib/sanity.api'
import { schema } from './schemas/schema'
import { COLORS } from './utilities/constants'

// build a preview url
async function getPreviewUrl(doc) {
  if (!doc) {
    return ''
  }
  const url = new URL('', location.origin)
  const host = window.location.host.includes('localhost')
    ? `http://${window.location.host}}`
    : `https://${window.location.host}}`
  url.pathname = `/api/preview`
  doc?.slug?.current
    ? url.searchParams.set('slug', doc?.slug?.current)
    : url.searchParams.set('slug', '')

  return url.href
}

// default document node for preview iframe - more here: https://www.sanity.io/docs/structure-builder-reference#9766ea34ddfb
const defaultDocumentNode = (S, { schemaType }) => {
  return S.document().views([
    S.view.form(),
    S.view
      .component(Iframe)
      .options({
        url: (doc) => getPreviewUrl(doc),
        loader: true,
        showDisplayUrl: true,
        reload: {
          button: true, // default `undefined`
          revision: true, // boolean | number. default `undefined`. If a number is provided, add a delay (in ms) before the automatic reload on document revision
        },
      })
      .title('Preview'),
  ])
}

export default defineConfig({
  basePath: '/studio',
  title: 'Ozarkedge Wildflowers',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool({ defaultDocumentNode }),
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    muxInput()
  ],
  form: {
    // Don't use this plugin when selecting files only (but allow all other enabled asset sources)
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource !== mediaAssetSource
        )
      },
    },
  },
  theme: buildLegacyTheme({
    /* Base theme colors */
    '--black': COLORS['oe-black'],
    '--white': COLORS['oe-white'],

    '--gray': '#666',
    '--gray-base': '#666',

    '--component-bg': COLORS['oe-green-yellow-100'],
    '--component-text-color': COLORS['oe-black'],

    /* Brand */
    '--brand-primary': COLORS['oe-blue-green-dark-200'],

    // Default button
    '--default-button-color': '#666',
    '--default-button-primary-color': COLORS['oe-blue-green-dark-200'],
    '--default-button-success-color': COLORS['oe-green-500'],
    '--default-button-warning-color': COLORS['oe-green-yellow-500'],
    '--default-button-danger-color': COLORS['oe-red-500'],

    /* State */
    '--state-info-color': COLORS['oe-blue-green-dark-200'],
    '--state-success-color': COLORS['oe-green-400'],
    '--state-warning-color': COLORS['oe-green-yellow-500'],
    '--state-danger-color': COLORS['oe-red-500'],

    /* Navbar */
    '--main-navigation-color': COLORS['oe-green-yellow-100'],
    '--main-navigation-color--inverted': COLORS['oe-green-yellow-300'],

    '--focus-color': COLORS['oe-blue-green-dark-300'],
  }),
})
