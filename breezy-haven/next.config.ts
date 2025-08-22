import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      new URL(
        'https://aljspbbvlhvassukqbyt.supabase.co/storage/v1/object/public/cabin-images/**'
      ),
      new URL('https://lh3.googleusercontent.com/**'),
    ],
  },
  // output: 'export',
};

export default nextConfig;
