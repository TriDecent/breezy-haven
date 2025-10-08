import { Metadata } from 'next';

type Route = {
  href: string;
  metadata: Metadata;
  nested?: Record<string, Route>;
};

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export const ROUTES = {
  root: defineRoute({
    href: '/',
    metadata: {
      metadataBase: new URL(BASE_URL ?? ''),
      title: {
        template: '%s - The Breezy Haven',
        default:
          'Luxury Cabin Retreat in the Italian Dolomites | The Breezy Haven',
      },
      icons: '/logo.png',
    },
  }),
  home: defineRoute({
    href: '/',
    metadata: {
      description:
        'Escape to The Breezy Haven — luxury eco-friendly cabins in the Italian Dolomites. Breathtaking views, comfort, and nature-first experiences.',
      keywords: [
        'luxury cabin retreat Italy',
        'Dolomites eco lodge',
        'nature getaway Italy',
        'romantic cabin Dolomites',
        'eco-friendly luxury stay',
      ],
      openGraph: {
        title: 'The Breezy Haven | Luxury Cabin Retreat',
        description:
          'Discover luxury cabins in the Italian Dolomites — perfect for romantic getaways, family trips, and nature lovers.',
        url: BASE_URL,
        siteName: 'The Breezy Haven',
        images: [
          {
            url: '/og/bg.png',
            width: 1200,
            height: 630,
            alt: 'Luxury Cabin Retreat in the Dolomites',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'The Breezy Haven | Luxury Cabin Retreat',
        description:
          'Eco-friendly luxury cabins in the Italian Dolomites. Book your dream escape today.',
        images: ['/og/bg.png'],
        creator: '@thebreezyhaven',
      },
      robots: 'index, follow',
      alternates: { canonical: BASE_URL || '/' },
    },
  }),

  about: defineRoute({
    href: '/guest/about',
    metadata: {
      title: 'About',
      description:
        'Learn the story behind The Breezy Haven — our eco vision and commitment to luxury, comfort, and nature.',
      keywords: [
        'about Breezy Haven',
        'eco-friendly cabins Italy',
        'luxury stay Dolomites',
        'our story',
      ],
      openGraph: {
        title: 'About The Breezy Haven',
        description:
          'The philosophy behind The Breezy Haven: sustainable, design-forward luxury cabins in the Dolomites.',
        url: `${BASE_URL}/about`,
        images: [
          {
            url: '/og/about1.jpg',
            width: 1200,
            height: 800,
            alt: 'About The Breezy Haven luxury cabins',
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'About The Breezy Haven',
        description:
          'Our story and vision for eco-luxury cabins in the Italian Dolomites.',
        images: ['/og/about2.jpeg'],
        creator: '@thebreezyhaven',
      },
      robots: 'index, follow',
      alternates: { canonical: `${BASE_URL}/about` },
    },
  }),

  account: defineRoute({
    href: '/guest/account',
    metadata: {
      title: {
        template: '%s - Account | The Breezy Haven',
        default: 'Account',
      },
      description:
        'Manage your profile, reservations, and account settings securely.',
      keywords: ['guest account', 'manage reservations', 'profile settings'],
      robots: 'noindex, follow',
      alternates: { canonical: `${BASE_URL}/account` },
    },
    nested: {
      profile: defineRoute({
        href: '/guest/account/profile',
        metadata: {
          title: 'My Profile',
          description: 'View and edit your personal details.',
          robots: 'noindex, follow',
          alternates: { canonical: `${BASE_URL}/account/profile` },
        },
      }),
      reservations: defineRoute({
        href: '/guest/account/reservations',
        metadata: {
          title: 'My Reservations',
          description:
            'Track, view, and manage all your cabin bookings at The Breezy Haven.',
          robots: 'noindex, follow',
          alternates: { canonical: `${BASE_URL}/account/reservations` },
        },
        nested: {
          edit: defineRoute({
            href: '/guest/account/reservations/edit',
            metadata: {
              title: 'Edit Reservation',
              description: 'Update your cabin booking details.',
              robots: 'noindex, nofollow',
              alternates: {
                canonical: `${BASE_URL}/account/reservations/edit`,
              },
            },
            nested: {
              bookingId: defineRoute({
                href: 'unknown',
                metadata: {
                  title: 'Reservation Details',
                  description: 'Detailed view of your booking.',
                  robots: 'noindex, nofollow',
                },
              }),
            },
          }),
        },
      }),
    },
  }),

  cabins: defineRoute({
    href: '/guest/cabins',
    metadata: {
      title: 'Cabins',
      description:
        'Browse eco-friendly luxury cabins in the Dolomites. Find your perfect stay surrounded by nature.',
      keywords: [
        'luxury cabins Dolomites',
        'eco lodge Italy',
        'mountain cabins Italy',
        'nature holiday Dolomites',
        'sustainable luxury retreat',
      ],
      openGraph: {
        title: 'Luxury Cabins in the Dolomites | The Breezy Haven',
        description:
          'Choose from eco-friendly luxury cabins designed for comfort, romance, and adventure.',
        url: `${BASE_URL}/cabins`,
        images: [
          {
            url: '/og/cabins.jpg',
            width: 1200,
            height: 800,
            alt: 'Luxury cabins in the Dolomites',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Luxury Cabins in the Dolomites',
        description:
          'Plan your dream escape to The Breezy Haven — luxury eco-friendly cabins in the Dolomites.',
        images: ['/og/cabins.jpg'],
        creator: '@thebreezyhaven',
      },
      robots: 'index, follow',
      alternates: { canonical: `${BASE_URL}/cabins` },
    },
    nested: {
      cabinId: defineRoute({
        href: 'unknown',
        metadata: {
          title: 'Cabin Details | The Breezy Haven',
          description:
            'Detailed information about this cabin: amenities, availability, and booking options.',
          keywords: ['cabin details', 'Dolomites luxury stay', 'cabin booking'],
          openGraph: {
            title: 'Cabin Details | The Breezy Haven',
            description:
              'Explore features, design, and booking information for your chosen cabin.',
            url: `${BASE_URL}/cabins/[cabinId]`,
            images: [
              {
                url: '/og/cabin-detail.jpg',
                width: 1200,
                height: 800,
                alt: 'Cabin detail in the Dolomites',
              },
            ],
            locale: 'en_US',
            type: 'article',
          },
          twitter: {
            card: 'summary_large_image',
            title: 'Cabin Details | The Breezy Haven',
            description:
              'See full details and amenities of our cabins in the Italian Dolomites.',
            images: ['/og/cabin-detail.jpg'],
          },
          robots: 'index, follow',
        },
      }),
    },
  }),

  login: defineRoute({
    href: '/guest/login',
    metadata: {
      title: 'Login',
      description: 'Access your account to manage bookings and profile.',
      robots: 'noindex, nofollow',
      alternates: { canonical: `${BASE_URL}/login` },
    },
  }),

  'setup-new-guest': defineRoute({
    href: '/guest/setup-new-guest',
    metadata: {
      title: 'Initializing Your Account',
      description: 'We are setting up your guest profile. Please wait...',
      robots: 'noindex, nofollow',
      alternates: { canonical: `${BASE_URL}/setup-new-guest` },
    },
  }),

  staff: defineRoute({
    href: '/staff',
    metadata: {
      title: {
        template: '%s - Staff | The Breezy Haven',
        default: 'Staff',
      },
    },
    nested: {
      dashboard: defineRoute({
        href: '/staff/dashboard',
        metadata: {
          title: 'Dashboard',
        },
      }),
      bookings: defineRoute({
        href: '/staff/bookings',
        metadata: {
          title: 'Bookings',
        },
        nested: {
          ['create-new-booking']: defineRoute({
            href: '/staff/bookings/create-new-booking',
            metadata: {
              title: 'Add a new booking',
            },
          }),
        },
      }),
      cabins: defineRoute({
        href: '/staff/cabins',
        metadata: {
          title: 'Cabins',
        },
      }),
      user: defineRoute({
        href: '/staff/user',
        metadata: {
          title: 'User',
        },
      }),
      settings: defineRoute({
        href: '/staff/settings',
        metadata: {
          title: 'Settings',
        },
      }),
      profile: defineRoute({
        href: '/staff/profile',
        metadata: {
          title: 'My profile',
        },
      }),
    },
  }),
} as const;

function defineRoute<T extends Route>(route: T): T {
  return route;
}
