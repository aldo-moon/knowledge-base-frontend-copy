/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/base-conocimientos",
        permanent: false, // false = redirección temporal (302)
      },
    ];
  },
};

module.exports = nextConfig
