const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
    loader: 'custom',
  },
  productionBrowserSourceMaps: true,
}

module.exports = withBundleAnalyzer(nextConfig)
