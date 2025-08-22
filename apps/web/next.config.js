/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: true,
  transpilePackages: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/react-fontawesome'],
};
