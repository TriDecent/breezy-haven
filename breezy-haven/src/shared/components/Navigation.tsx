'use client';

import { useSession } from 'next-auth/react';
import { ROUTES } from '../constants/ROUTES';
import NavItem from './NavItem';

interface Route {
  readonly title: string;
  readonly href: string;
}

const routes: readonly Route[] = [
  { title: ROUTES.cabins.metadata.title, href: ROUTES.cabins.href },
  { title: ROUTES.about.metadata.title, href: ROUTES.about.href },
  { title: ROUTES.account.metadata.title, href: ROUTES.account.href },
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
