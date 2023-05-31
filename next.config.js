const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  plugins: [["styled-components", { "ssr": true }]],
  publicRuntimeConfig: {
    version,
  },
}

module.exports = nextConfig
