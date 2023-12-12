/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'imgix',
    path: 'https://zkwallet.welldonestudio.io',
  },
};

module.exports = nextConfig;
