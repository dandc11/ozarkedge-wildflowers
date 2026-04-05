import { EyeOpenIcon } from '@sanity/icons'

/**
 * Maps document types to their frontend URL paths.
 * Must stay in sync with the locations defined in sanity/presentation/resolve.js
 * and the route structure in app/.
 *
 * @type {Record<string, (slug?: string) => string>}
 */
const PREVIEW_URL_BUILDERS = {
  nativePlant: (slug) => `/native-plants/${slug}`,
  season: (slug) => `/season/${slug}`,
  landingPage: () => '/',
  aboutPage: () => '/about',
  plantListPage: () => '/native-plants',
}

/** Document types that require a slug to build a preview URL */
const SLUG_REQUIRED_TYPES = new Set(['nativePlant', 'season'])

/**
 * Custom document action that navigates to the current document in the Presentation tool
 * with the correct preview URL pre-loaded in the iframe.
 *
 * Allows editors to jump from Structure editing to a live preview in one click,
 * without having to dig through the Presentation tool UI.
 *
 * Uses the current browser URL to derive the Presentation tool URL,
 * replacing the /structure segment with /presentation and adding a
 * ?preview= search param. Works in both hosted and local Studio.
 *
 * @param {import('sanity').DocumentActionProps} props
 * @returns {import('sanity').DocumentActionDescription | null}
 */
export function OpenInPresentationAction(props) {
  const { type, draft, published } = props

  const buildPreviewUrl = PREVIEW_URL_BUILDERS[type]

  // Only show for document types that have presentation locations
  if (!buildPreviewUrl) {
    return null
  }

  // Prefer draft (what the editor is likely working on) then fall back to published
  const doc = draft || published
  const slug = doc?.slug?.current
  const needsSlug = SLUG_REQUIRED_TYPES.has(type)

  // Build the preview URL if we have the necessary data
  const previewUrl = needsSlug ? (slug ? buildPreviewUrl(slug) : null) : buildPreviewUrl()
  const isDisabled = !previewUrl

  return {
    label: 'Open in Presentation',
    icon: EyeOpenIcon,
    title: isDisabled
      ? 'A slug is required to preview this document'
      : 'Open this document in the Presentation tool for live preview',
    disabled: isDisabled,
    onHandle: () => {
      // Navigate by replacing the /structure tool segment in the current URL
      // with /presentation. Works in both hosted (sanity.io) and local Studio.
      const url = new URL(window.location.href)
      const structureIndex = url.pathname.indexOf('/structure')
      if (structureIndex !== -1) {
        url.pathname = url.pathname.substring(0, structureIndex) + '/presentation'
        url.search = `?preview=${encodeURIComponent(previewUrl)}`
        window.location.assign(url.href)
      }
    },
  }
}
