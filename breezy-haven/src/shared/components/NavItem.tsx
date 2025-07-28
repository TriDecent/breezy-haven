'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Badge from './Badge';

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
          <Badge avatarSrc={authImage} name={getName(authName ?? '')} />
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
