'use client';

import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from './SignOutButton';

const navLinks = [
  {
    name: 'Home',
    href: '/account',
    icon: <HomeIcon className='text-primary-600 h-5 w-5' />,
  },
  {
    name: 'Reservations',
    href: '/account/reservations',
    icon: <CalendarDaysIcon className='text-primary-600 h-5 w-5' />,
  },
  {
    name: 'Guest profile',
    href: '/account/profile',
    icon: <UserIcon className='text-primary-600 h-5 w-5' />,
  },
] as const;

export default function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className='border-primary-900 h-full border-r'>
      <ul className='flex h-full flex-col gap-2 text-lg'>
        {navLinks.map(link => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`hover:bg-primary-900 hover:text-primary-100 flex items-center gap-4 rounded-l-md px-5 py-3 font-semibold transition-colors ${pathname === link.href ? 'bg-primary-900' : ''}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}

        <li className='mt-auto'>
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}
