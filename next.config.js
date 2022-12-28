/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // images: {
    //     domains: ['cdn.sanity.io'],
    // },
};

const STUDIO_REWRITE = {
    source: '/studio/:path*',
    destination:
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3333/studio/:path*'
            : '/studio/index.html',
};

module.exports = {
    rewrites: () => [STUDIO_REWRITE],
    images: {
        domains: ['cdn.sanity.io'],
        loader: 'custom',
    },
    nextConfig,
};
