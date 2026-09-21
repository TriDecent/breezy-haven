import type { NextConfig } from 'next';

import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      new URL(
        'https://aljspbbvlhvassukqbyt.supabase.co/storage/v1/object/public/cabin-images/**'
      ),
      new URL('https://lh3.googleusercontent.com/**'),
      new URL(
        'https://aljspbbvlhvassukqbyt.supabase.co/storage/v1/object/public/avatars/**'
      ),
    ],
  },
  cacheComponents: true,
  cacheLife: {
    'default-strategy': {
      stale: 300, // 5 mins
      revalidate: 604800, // 1 week
      expire: 2592000, // 30 days
    },
  },
  // output: 'export',
};

export default process.env.ANALYZE === 'true'
  ? bundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;
