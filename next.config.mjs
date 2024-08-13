/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'interstellar-app-uploads.s3.us-west-2.amazonaws.com',
        pathname: '**', // This matches all paths under the hostname
      },
    ],
  },
  experimental: {
    runtime: 'edge', // Correctly placed under the top-level experimental key
  },
}

// Correct placement of export
export default nextConfig
