/**
 * Custom Next.js Image loader that requests images directly from Sanity CDN
 * at the exact resolution needed for each srcset entry. Configured via
 * `images.loaderFile` in next.config.js.
 *
 * Without this, Next.js proxies every srcset variant through `/_next/image`
 * using the same base Sanity URL (e.g. w=1600). Since Next.js cannot upscale,
 * any srcset entry wider than 1600px still delivers a 1600px image — causing
 * blur at widescreen viewports.
 *
 * The `h` param is intentionally removed so Sanity returns the full image at
 * the requested width with its natural (or rect-cropped) aspect ratio. CSS
 * `object-fit: cover` handles visual cropping in the browser. Keeping `h`
 * would force Sanity to crop to a fixed aspect ratio (e.g. 4:3), which can
 * reduce effective resolution when the requested height exceeds the source.
 *
 * @param {Object} params - Loader params provided by Next.js Image
 * @param {string} params.src - The base Sanity CDN URL (from urlForImage)
 * @param {number} params.width - The target width for this srcset entry
 * @param {number} [params.quality] - Optional quality override
 * @returns {string} A Sanity CDN URL with the target width applied
 */
export default function sanityLoader({ src, width, quality }) {
  // Only rewrite Sanity CDN URLs; pass anything else through unchanged
  if (!src.includes('cdn.sanity.io')) {
    return `${src}?w=${width}${quality ? `&q=${quality}` : ''}`
  }

  const url = new URL(src)
  const params = url.searchParams

  params.set('w', String(width))
  // Remove h so Sanity returns the natural aspect ratio at the requested width
  params.delete('h')

  if (quality) {
    params.set('q', String(quality))
  }

  return url.toString()
}
