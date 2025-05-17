
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    GENKIT_DISABLE_TELEMETRY: 'true',
  },
  webpack: (config, { isServer }) => {
    // Handle OpenTelemetry issues
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/exporter-jaeger': false,
    };
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Allow data URIs for AI generated images
    dangerouslyAllowSVG: true, 
    contentDispositionType: 'attachment',
    // Updated CSP to allow data: for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; img-src 'self' data: images.pexels.com placehold.co; sandbox;", // Added images.pexels.com here too for completeness
    domains: ['placehold.co', 'images.pexels.com'], // Keep existing domains if any
    // For Next.js 14+, remotePatterns is preferred but domains might still be useful for data URIs in some contexts.
    // However, for data URIs, the main thing is to ensure they are not blocked by CSP if you have one.
    // Next/image handles data URIs directly without needing them in remotePatterns.
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increased for potentially larger image data URIs
    },
  },
};

export default nextConfig;
