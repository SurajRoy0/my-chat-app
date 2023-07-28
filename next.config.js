

require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_KEY: process.env.API_KEY,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"]
  }
};

module.exports = nextConfig;
