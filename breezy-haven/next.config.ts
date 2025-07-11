import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aljspbbvlhvassukqbyt.supabase.co',
      },
    ],
  },
};

export default nextConfig;
