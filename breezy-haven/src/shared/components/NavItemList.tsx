'use client';
import defaultUser from '@/../public/default-user.png';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Route {
  readonly title: string;
  readonly href: string;
}

const routes: readonly Route[] = [
  { title: 'Cabins', href: '/cabins' },
  { title: 'About', href: '/about' },
  { title: 'Guest area', href: '/account' },
];

export default function NavItemList({
  authName,
  authImage,
}: {
  authName?: string | null;
  authImage?: string | null;
}) {
  const pathname = usePathname();
  const pathSegments = pathname
    .split('/')
    .filter(segment => segment !== '')
    .map(segment => `/${segment}`);
  const [firstSegment] = pathSegments;

  return (
    <>
      {routes.map(route => (
        <li key={route.href}>
          <Link
            href={route.href}
            className={`hover:text-accent-400 transition-colors ${firstSegment === route.href ? 'text-accent-500' : ''} `}
          >
            {route.href === routes[2].href && (authName || authImage) ? (
              <div className='bg-accent-700/40 flex items-center gap-2 rounded-full px-3 py-1'>
                <Image
                  src={authImage ?? defaultUser}
                  width={32}
                  height={32}
                  alt='user avatar'
                  className='ring-accent-500 rounded-full object-cover object-center ring'
                />
                <span className='font-semibold'>{getName(authName ?? '')}</span>
              </div>
            ) : (
              route.title
            )}
          </Link>

          {firstSegment === route.href ? (
            <motion.hr
              layoutId='route-indicator'
              className='border-accent-600 border'
            />
          ) : null}
        </li>
      ))}
    </>
  );
}

function getName(fullName: string): string {
  return fullName.trim().split(' ')[0];
}
