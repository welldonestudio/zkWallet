/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        loader: 'imgix',
        path: 'https://zkwallet.welldonestudio.io',
    },
};

module.exports = nextConfig;