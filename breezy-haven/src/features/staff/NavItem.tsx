'use client';

import { ROUTES } from '@/shared';
import {
  CalendarIcon,
  HomeIcon,
  HomeModernIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Icons = {
  [ROUTES.staff.nested.dashboard.metadata.title]: <HomeIcon width={24} />,
  [ROUTES.staff.nested.bookings.metadata.title]: <CalendarIcon width={24} />,
  [ROUTES.staff.nested.cabins.metadata.title]: <HomeModernIcon width={24} />,
  [ROUTES.staff.nested.user.metadata.title]: <UserIcon width={24} />,
  [ROUTES.staff.nested.settings.metadata.title]: <SettingsIcon width={24} />,
} as const;

export function NavItem({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(segment => segment);
  const isActiveNav =
    segments.length === 2 &&
    segments.pop()?.trim().toLowerCase() === title.trim().toLowerCase();

  return (
    <Link
      href={href}
      className={`hover:bg-border relative flex justify-center rounded-md p-3 ${isActiveNav ? 'bg-border' : ''}`}
    >
      <p className='flex min-w-36 items-center gap-4'>
        <span>{Icons[title]}</span>
        <span>{title}</span>
      </p>
      <AnimatePresence>
        {isActiveNav ? (
          <motion.hr
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring' }}
            className='bg-chart-3 absolute inset-x-0 bottom-1 mx-auto w-16'
          />
        ) : null}
      </AnimatePresence>
    </Link>
  );
}
