import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        'https://aljspbbvlhvassukqbyt.supabase.co/storage/v1/object/public/cabin-images/**'
      ),
    ],
  },
};

export default nextConfig;
