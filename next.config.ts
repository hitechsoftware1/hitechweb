import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Admin-editable image fields (Web Management hero/founder image,
      // Marketplace product images, News/Team/Banners) accept any pasted
      // URL, so any HTTPS host is allowed here rather than a fixed list.
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
