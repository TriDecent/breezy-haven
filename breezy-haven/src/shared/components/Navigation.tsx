'use client';

import { useSession } from 'next-auth/react';
import NavItem from './NavItem';

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
  const { data } = useSession();

  return (
    <nav className='z-10 md:text-xl'>
      <ul className='flex items-center gap-4 sm:gap-6 lg:gap-16'>
        {routes.map(route => (
          <li key={route.href}>
            <NavItem
              routeTitle={route.title}
              routeHref={route.href}
              authName={data?.user?.name}
              authImage={data?.user?.image}
              shouldRenderAuthRoute={route.href === routes[2].href}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
