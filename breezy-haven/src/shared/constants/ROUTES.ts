import { Metadata } from 'next';

type Route = {
  href: string;
  metadata: Metadata;
  nested?: Record<string, Route>;
};

export const ROUTES = {
  home: defineRoute({
    href: '/',
    metadata: {
      title: {
        template: '%s - The Breezy Haven',
        default: 'Welcome to The Breezy Haven',
      },
      description:
        'A high-end cabin retreat in the Italian Dolomites, surrounded by enchanting woodlands. Book your dream escape today.',
      keywords: [
        'cabin retreat',
        'Italian Dolomites',
        'luxury stay',
        'nature getaway',
      ],
      icons: '/logo.png',
      openGraph: {
        title: 'Welcome to The Breezy Haven',
        description:
          'A high-end cabin retreat in the Italian Dolomites, surrounded by enchanting woodlands.',
        url: 'https://thebreezyhaven.com',
        siteName: 'The Breezy Haven',
        images: ['/og/home.jpg'],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Welcome to The Breezy Haven',
        description:
          'A luxury cabin retreat in the Italian Dolomites — perfect for nature lovers and dreamers.',
        images: ['/og/home.jpg'],
      },
      robots: 'index, follow',
    },
  }),
  about: defineRoute({
    href: '/about',
    metadata: {
      title: 'About',
      description:
        'Learn the story behind The Breezy Haven and our commitment to comfort, luxury, and nature.',
      keywords: ['about us', 'Breezy Haven story', 'eco-friendly cabins'],
      openGraph: {
        title: 'About - The Breezy Haven',
        description:
          'Learn the story behind The Breezy Haven and our commitment to comfort, luxury, and nature.',
        url: 'https://thebreezyhaven.com/about',
        images: ['/og/about.jpg'],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'About The Breezy Haven',
        description:
          'Discover the story behind our luxury cabins in the Italian Dolomites.',
        images: ['/og/about.jpg'],
      },
      robots: 'index, follow',
    },
  }),
  account: defineRoute({
    href: '/account',
    metadata: {
      title: 'Guest area',
      description: 'Manage your profile, reservations, and account settings.',
      keywords: ['guest account', 'manage reservations', 'profile settings'],
      robots: 'noindex, follow',
    },
    nested: {
      profile: defineRoute({
        href: '/account/profile',
        metadata: {
          title: 'My profile',
          description:
            'View and edit your personal details at The Breezy Haven.',
          robots: 'noindex, follow',
        },
      }),
      reservations: defineRoute({
        href: '/account/reservations',
        metadata: {
          title: 'My Reservations',
          description: 'Track, view, and manage all your cabin bookings.',
          robots: 'noindex, follow',
        },
      }),
    },
  }),
  cabins: defineRoute({
    href: '/cabins',
    metadata: {
      title: 'Cabins',
      description:
        'Explore our collection of luxury cabins in the Italian Dolomites.',
      keywords: [
        'cabins',
        'Italian Dolomites',
        'luxury stay',
        'nature getaway',
      ],
      openGraph: {
        title: 'Cabins - The Breezy Haven',
        description:
          'Explore our collection of luxury cabins in the Italian Dolomites.',
        url: 'https://thebreezyhaven.com/cabins',
        images: ['/og/cabins.jpg'],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Luxury Cabins in the Italian Dolomites',
        description: 'Choose your perfect cabin retreat in nature.',
        images: ['/og/cabins.jpg'],
      },
      robots: 'index, follow',
    },
    nested: {
      cabinId: defineRoute({
        href: 'unknown',
        metadata: {
          title: 'Cabin Details',
          description:
            'Detailed information about this cabin, amenities, and booking options.',
          robots: 'index, follow',
        },
      }),
    },
  }),
  login: defineRoute({
    href: '/login',
    metadata: {
      title: 'Login',
      description: 'Access your account to manage bookings and profile.',
      robots: 'noindex, follow',
    },
  }),
  'setup-new-guest': defineRoute({
    href: '/setup-new-guest',
    metadata: {
      title: 'Initializing your account',
      description: 'We are setting up your guest profile. Please wait...',
      robots: 'noindex, nofollow',
    },
  }),
} as const;

// Let it return T shape object instead of Route object since Route object does not know the properties of nested property
function defineRoute<T extends Route>(route: T): T {
  return route;
}
