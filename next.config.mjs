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
}

export default nextConfig
