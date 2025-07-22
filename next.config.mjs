/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: ['@react-pdf/renderer'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'interstellar-app-uploads.s3.us-west-2.amazonaws.com',
        pathname: '**', // This matches all paths under the hostname
      },
    ],
    unoptimized: true, // Add this line to disable image optimization globally
  },
  sassOptions: {
    silenceDeprecations: [
      'legacy-js-api',
      'import',
      'global-builtin',
      'color-functions',
      'mixed-decls',
    ],
    quietDeps: true,
    verbose: false,
  },
}

// Correct placement of export
export default nextConfig
