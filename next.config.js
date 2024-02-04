/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CRYPTOJS_SECRET_KEY: process.env.CRYPTOJS_SECRET_KEY,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    TENOR_API_KEY: process.env.TENOR_API_KEY,
    IPGEOLOCATION_API_KEY: process.env.IPGEOLOCATION_API_KEY
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.giphy.com'
      },
      {
        protocol: 'https',
        hostname: 'media0.giphy.com'
      },
      {
        protocol: 'https',
        hostname: 'media1.giphy.com'
      },
      {
        protocol: 'https',
        hostname: 'media2.giphy.com'
      },
      {
        protocol: 'https',
        hostname: 'media3.giphy.com'
      },
      {
        protocol: 'https',
        hostname: 'media4.giphy.com'
      },
      {
        protocol: 'https',
        hostname: 'media.tenor.com'
      }
    ]
  }
};

module.exports = nextConfig;
