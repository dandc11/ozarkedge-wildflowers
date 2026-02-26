import { EyeOpenIcon } from '@sanity/icons'
import { useWorkspace } from 'sanity'
import { useRouter } from 'sanity/router'

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
 * Uses router.navigateUrl with the workspace basePath to construct the full
 * Presentation tool URL including the ?preview= search param, so the iframe
 * loads the correct frontend page.
 *
 * @param {import('sanity').DocumentActionProps} props
 * @returns {import('sanity').DocumentActionDescription | null}
 */
export function OpenInPresentationAction(props) {
  const { id, type, draft, published } = props
  const router = useRouter()
  const { basePath } = useWorkspace()

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
      // Build the full browser path including the Studio basePath (e.g. /studio)
      // so the URL correctly lands inside the Studio workspace.
      // Full path: <basePath>/presentation/<type>/<id>?preview=<frontendPath>
      router.navigateUrl({
        path: `${basePath}/presentation/${type}/${id}?preview=${previewUrl}`,
      })
    },
  }
}
