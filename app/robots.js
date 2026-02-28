/**
 * Generates the robots.txt for the site.
 * Blocks /studio from indexing and references the sitemap.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/studio',
      },
    ],
    sitemap: 'https://ozarkedgewildflowers.com/sitemap.xml',
  }
}
