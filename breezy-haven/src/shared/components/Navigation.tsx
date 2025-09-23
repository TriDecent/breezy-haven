'use client';

import { ROUTES } from '../constants/ROUTES';
import { useGetGuestAuthQuery } from '../store/authApi';
import NavItem from './NavItem';

interface Route {
  readonly title: string;
  readonly href: string;
}

const routes: readonly Route[] = [
  { title: ROUTES.cabins.metadata.title, href: ROUTES.cabins.href },
  { title: ROUTES.about.metadata.title, href: ROUTES.about.href },
  { title: ROUTES.account.metadata.title.default, href: ROUTES.account.href },
];

export default function Navigation() {
  const { data, isError, isFetching, isLoading } =
    useGetGuestAuthQuery(undefined);

  return isError ? (
    <nav className='z-10 md:text-xl'>
      <ul className='flex items-center gap-4 sm:gap-6 lg:gap-16'>
        {routes.map(route => (
          <li key={route.href}>
            <NavItem
              routeTitle={route.title}
              routeHref={route.href}
              authName={null}
              authImage={null}
              shouldRenderAuthRoute={route.href === routes[2].href}
              isAuthenticated={false}
              isLoading={false}
            />
          </li>
        ))}
      </ul>
    </nav>
  ) : (
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
              isAuthenticated={data?.isAuthenticated ?? false}
              isLoading={isLoading || isFetching}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
