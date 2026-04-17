const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Bypass /_next/image proxy — request images directly from Sanity CDN
    // at the exact resolution needed for each srcset entry
    loader: 'custom',
    loaderFile: './sanity/lib/sanity.loader.js',
    // Predefine qualities used across the app to avoid future warnings
    qualities: [75, 80, 85, 90, 95],
  },
  async redirects() {
    return [
      {
        source: '/favicon-192x192.png',
        destination: '/android-chrome-192x192.png',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        // Allow Sanity Studio (hosted and local) to embed the site in an iframe
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://*.sanity.io https://*.sanity.studio http://localhost:3333",
          },
        ],
      },
    ]
  },
  productionBrowserSourceMaps: true,
}

module.exports = withBundleAnalyzer(nextConfig)
