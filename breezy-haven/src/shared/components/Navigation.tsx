'use client';
import { motion } from 'framer-motion';
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

export default function Navigation() {
  const pathname = usePathname();
  const pathSegments = pathname
    .split('/')
    .filter(segment => segment !== '')
    .map(segment => `/${segment}`);
  const [firstSegment] = pathSegments;

  return (
    <nav className='z-10 md:text-xl'>
      <ul className='flex items-center gap-4 sm:gap-6 lg:gap-16'>
        {routes.map(route => (
          <li key={route.href}>
            <Link
              href={route.href}
              className={`hover:text-accent-400 transition-colors ${firstSegment === route.href ? 'text-accent-500' : ''} `}
            >
              {route.title}
            </Link>
            {firstSegment === route.href ? (
              <motion.hr
                layoutId='route-indicator'
                className='border-accent-600 border'
              />
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
