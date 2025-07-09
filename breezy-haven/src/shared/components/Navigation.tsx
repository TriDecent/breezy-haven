import Link from 'next/link';

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
  return (
    <nav className='z-10 md:text-xl'>
      <ul className='flex items-center gap-4 sm:gap-6 lg:gap-16'>
        {routes.map(route => (
          <li key={route.href}>
            <Link
              href={route.href}
              className='hover:text-accent-400 transition-colors'
            >
              {route.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
