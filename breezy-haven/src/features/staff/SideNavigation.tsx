'use client';
import breezyHavenLogo from '@/../public/logo.png';

import {
  CalendarIcon,
  HomeIcon,
  HomeModernIcon,
  UserIcon,
} from '@heroicons/react/24/solid';

import { Shimmer } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { motion } from 'framer-motion';
import { SettingsIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NavItem } from './NavItem';

const Icons = {
  [ROUTES.staff.nested.dashboard.metadata.title]: <HomeIcon width={24} />,
  [ROUTES.staff.nested.bookings.metadata.title]: <CalendarIcon width={24} />,
  [ROUTES.staff.nested.cabins.metadata.title]: <HomeModernIcon width={24} />,
  [ROUTES.staff.nested.user.metadata.title]: <UserIcon width={24} />,
  [ROUTES.staff.nested.settings.metadata.title]: <SettingsIcon width={24} />,
} as const;

export function SideNavigation() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(segment => segment);
  const currentSegment =
    segments.length === 2 && segments.pop()?.trim().toLowerCase();

  return (
    <div className='sticky top-0 flex h-full flex-col gap-8 py-4'>
      <div className='flex flex-col items-center gap-4 select-none'>
        <motion.div
          transition={{ type: 'spring' }}
          whileHover={{ rotate: 360 }}
          whileTap={{ rotate: 360 }}
        >
          <Image
            src={breezyHavenLogo}
            width={69}
            height={69}
            alt='The Breezy Haven logo'
            draggable={false}
            priority
          />
        </motion.div>

        <p>
          <Shimmer className='text-xl'>The Breezy Haven</Shimmer>
        </p>
      </div>
      <ul className='px-4'>
        <nav className='flex flex-col gap-6'>
          {Object.values(ROUTES.staff.nested).map(route =>
            !route.href.includes('profile') ? (
              <li key={route.href}>
                <NavItem
                  href={route.href}
                  icon={Icons[route.metadata.title]}
                  title={route.metadata.title}
                  isSelected={
                    currentSegment === route.metadata.title.toLowerCase().trim()
                  }
                />
              </li>
            ) : null
          )}
        </nav>
      </ul>
    </div>
  );
}
