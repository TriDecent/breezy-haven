'use client';
import defaultUser from '@/../public/default-user.png';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavItem({
  routeTitle,
  routeHref,
  authName,
  authImage,
  shouldRenderAuthRoute,
}: {
  routeTitle: string;
  routeHref: string;
  authName?: string | null;
  authImage?: string | null;
  shouldRenderAuthRoute: boolean;
}) {
  const pathname = usePathname();
  const pathSegments = pathname
    .split('/')
    .filter(segment => segment !== '')
    .map(segment => `/${segment}`);
  const [firstSegment] = pathSegments;

  return (
    <>
      <Link
        href={routeHref}
        className={`hover:text-accent-400 transition-colors ${firstSegment === routeHref ? 'text-accent-500' : ''} `}
      >
        {shouldRenderAuthRoute && (authName || authImage) ? (
          <div className='bg-accent-700/40 flex items-center gap-2 rounded-full px-3 py-1'>
            <Image
              src={authImage ?? defaultUser}
              width={28}
              height={28}
              alt='user avatar'
              className='ring-accent-500 rounded-full object-cover object-center ring'
            />
            <span className='font-semibold'>{getName(authName ?? '')}</span>
          </div>
        ) : (
          routeTitle
        )}
      </Link>

      {firstSegment === routeHref ? (
        <motion.hr
          layoutId='route-indicator'
          className='border-accent-600 border'
        />
      ) : null}
    </>
  );
}

function getName(fullName: string): string {
  return fullName.trim().split(' ')[0];
}
