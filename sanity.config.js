// sanity.config.js
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import schemas from './schemas/schema'
import { visionTool } from '@sanity/vision'
import { media, mediaAssetSource } from 'sanity-plugin-media'
import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
} from './lib/sanity.api'
import Iframe from 'sanity-plugin-iframe-pane'
import { productionUrl } from './utilities/prodUrl'
import { buildLegacyTheme } from 'sanity'
import { COLORS } from './utilities/constants'

// Customise this function to show the correct URL based on the current document
function getPreviewUrl(doc) {
  // console.log('doc', doc);
  // const url =  doc?.slug?.current && doc?.slug?.current !== '/'
  // ? `${window.location.host}/${doc.slug.current}`
  // : `${window.location.host}`
  // console.log('preview url', url);
  // return url;
  return `http://${window.location.host}/api/preview`;
}

const defaultDocumentNode = (S, { schemaType }) => {
  switch (schemaType) {
    case `landingPage` || `nativePlant`:
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
    default:
      return S.document().views([S.view.form()])
  }
}

export default defineConfig({
  basePath: '/studio',
  title: 'Ozarkedge Wildflowers',
  projectId,
  dataset,
  plugins: [
    deskTool({ defaultDocumentNode }),
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    productionUrl({ previewSecretId, types: ['landingPage', 'nativePlant', 'aboutPage','plantListPage',], apiVersion }),
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
  schema: {
    types: schemas,
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
