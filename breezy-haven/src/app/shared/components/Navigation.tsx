import Link from 'next/link';

interface Route {
  title: string;
  href: string;
}

const routes: readonly Route[] = [
  { title: 'Cabins', href: '/cabins' },
  { title: 'About', href: '/about' },
  { title: 'Account', href: '/account' },
];

export default function Navigation() {
  return (
    <ul className='flex flex-col'>
      {routes.map(route => (
        <li key={route.href}>
          <Link
            href={route.href}
            className='visited:text-blue-500 visited:underline'
          >
            {route.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
